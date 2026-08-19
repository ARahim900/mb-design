import CoreGraphics
import CoreText
import Foundation

struct OutlinedText {
    let path: String
    let width: CGFloat
    let height: CGFloat
}

func registerFont(at path: String) throws {
    let url = URL(fileURLWithPath: path) as CFURL
    var registrationError: Unmanaged<CFError>?

    if !CTFontManagerRegisterFontsForURL(url, .process, &registrationError) {
        let errorDescription = registrationError?.takeRetainedValue().localizedDescription ?? "Unknown font registration error"
        throw NSError(domain: "RIZZABrandAssets", code: 1, userInfo: [NSLocalizedDescriptionKey: errorDescription])
    }
}

func svgNumber(_ value: CGFloat) -> String {
    let rounded = (value * 100).rounded() / 100
    return String(format: "%.2f", rounded)
}

func svgPath(from path: CGPath) -> String {
    var commands: [String] = []

    path.applyWithBlock { pointer in
        let element = pointer.pointee
        switch element.type {
        case .moveToPoint:
            commands.append("M\(svgNumber(element.points[0].x)) \(svgNumber(element.points[0].y))")
        case .addLineToPoint:
            commands.append("L\(svgNumber(element.points[0].x)) \(svgNumber(element.points[0].y))")
        case .addQuadCurveToPoint:
            commands.append("Q\(svgNumber(element.points[0].x)) \(svgNumber(element.points[0].y)) \(svgNumber(element.points[1].x)) \(svgNumber(element.points[1].y))")
        case .addCurveToPoint:
            commands.append("C\(svgNumber(element.points[0].x)) \(svgNumber(element.points[0].y)) \(svgNumber(element.points[1].x)) \(svgNumber(element.points[1].y)) \(svgNumber(element.points[2].x)) \(svgNumber(element.points[2].y))")
        case .closeSubpath:
            commands.append("Z")
        @unknown default:
            break
        }
    }

    return commands.joined(separator: " ")
}

func outline(text: String, postScriptName: String, pointSize: CGFloat, tracking: CGFloat = 0) -> OutlinedText {
    let font = CTFontCreateWithName(postScriptName as CFString, pointSize, nil)
    let attributes: [NSAttributedString.Key: Any] = [
        NSAttributedString.Key(kCTFontAttributeName as String): font,
        NSAttributedString.Key(kCTKernAttributeName as String): tracking,
    ]
    let line = CTLineCreateWithAttributedString(NSAttributedString(string: text, attributes: attributes))
    let combinedPath = CGMutablePath()

    for case let run as CTRun in CTLineGetGlyphRuns(line) as NSArray {
        let glyphCount = CTRunGetGlyphCount(run)
        var glyphs = [CGGlyph](repeating: 0, count: glyphCount)
        var positions = [CGPoint](repeating: .zero, count: glyphCount)
        CTRunGetGlyphs(run, CFRange(location: 0, length: 0), &glyphs)
        CTRunGetPositions(run, CFRange(location: 0, length: 0), &positions)

        for index in 0..<glyphCount {
            guard let glyphPath = CTFontCreatePathForGlyph(font, glyphs[index], nil) else { continue }
            let transform = CGAffineTransform(translationX: positions[index].x, y: positions[index].y)
            combinedPath.addPath(glyphPath, transform: transform)
        }
    }

    var flip = CGAffineTransform(scaleX: 1, y: -1)
    let flippedPath = combinedPath.copy(using: &flip) ?? combinedPath
    let flippedBounds = flippedPath.boundingBoxOfPath
    var normalize = CGAffineTransform(translationX: -flippedBounds.minX, y: -flippedBounds.minY)
    let normalizedPath = flippedPath.copy(using: &normalize) ?? flippedPath
    let bounds = normalizedPath.boundingBoxOfPath

    return OutlinedText(path: svgPath(from: normalizedPath), width: bounds.width, height: bounds.height)
}

func fittedTransform(for outlinedText: OutlinedText, targetWidth: CGFloat, x: CGFloat, y: CGFloat) -> String {
    let scale = targetWidth / outlinedText.width
    return "translate(\(svgNumber(x)) \(svgNumber(y))) scale(\(svgNumber(scale)))"
}

func lockupSVG(arabic: OutlinedText, latin: OutlinedText, arabicColor: String, latinColor: String) -> String {
    let canvasWidth: CGFloat = 320
    let arabicTargetWidth: CGFloat = 212
    let latinTargetWidth: CGFloat = 238
    let arabicScale = arabicTargetWidth / arabic.width
    let latinScale = latinTargetWidth / latin.width
    let arabicHeight = arabic.height * arabicScale
    let latinHeight = latin.height * latinScale
    let arabicX = (canvasWidth - arabicTargetWidth) / 2
    let arabicY: CGFloat = 18
    let latinX = (canvasWidth - latinTargetWidth) / 2
    let latinY = arabicY + arabicHeight + 17
    let canvasHeight = latinY + latinHeight + 18

    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 \(svgNumber(canvasWidth)) \(svgNumber(canvasHeight))" role="img" aria-labelledby="title description">
      <title id="title">رزّة — RIZZA</title>
      <desc id="description">RIZZA approved Arabic-first brand lockup</desc>
      <path fill="\(arabicColor)" d="\(arabic.path)" transform="\(fittedTransform(for: arabic, targetWidth: arabicTargetWidth, x: arabicX, y: arabicY))" />
      <path fill="\(latinColor)" d="\(latin.path)" transform="\(fittedTransform(for: latin, targetWidth: latinTargetWidth, x: latinX, y: latinY))" />
    </svg>
    """
}

func appIconSVG(arabic: OutlinedText, latin: OutlinedText) -> String {
    let arabicTargetWidth: CGFloat = 306
    let latinTargetWidth: CGFloat = 272
    let arabicScale = arabicTargetWidth / arabic.width
    let arabicHeight = arabic.height * arabicScale
    let arabicX = (512 - arabicTargetWidth) / 2
    let arabicY: CGFloat = 118
    let latinX = (512 - latinTargetWidth) / 2
    let latinY = arabicY + arabicHeight + 29

    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title description">
      <title id="title">رزّة — RIZZA</title>
      <desc id="description">RIZZA application icon</desc>
      <defs>
        <radialGradient id="background" cx="44%" cy="30%" r="82%">
          <stop offset="0" stop-color="#4A2418" />
          <stop offset="0.48" stop-color="#2F1713" />
          <stop offset="1" stop-color="#1C1417" />
        </radialGradient>
        <linearGradient id="copper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#DEA276" />
          <stop offset="0.55" stop-color="#C98256" />
          <stop offset="1" stop-color="#A45F3D" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#background)" />
      <path fill="url(#copper)" d="\(arabic.path)" transform="\(fittedTransform(for: arabic, targetWidth: arabicTargetWidth, x: arabicX, y: arabicY))" />
      <path fill="#FFF9F2" d="\(latin.path)" transform="\(fittedTransform(for: latin, targetWidth: latinTargetWidth, x: latinX, y: latinY))" />
    </svg>
    """
}

func monochromeMarkSVG(symbol: OutlinedText) -> String {
    let targetWidth: CGFloat = 410
    let scale = targetWidth / symbol.width
    let targetHeight = symbol.height * scale
    let x = (512 - targetWidth) / 2
    let y = (512 - targetHeight) / 2

    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title">
      <title id="title">رزّة</title>
      <path fill="#000000" d="\(symbol.path)" transform="\(fittedTransform(for: symbol, targetWidth: targetWidth, x: x, y: y))" />
    </svg>
    """
}

func symbolIconSVG(symbol: OutlinedText) -> String {
    let targetWidth: CGFloat = 310
    let scale = targetWidth / symbol.width
    let targetHeight = symbol.height * scale
    let x = (512 - targetWidth) / 2
    let y = (512 - targetHeight) / 2

    return """
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="title">
      <title id="title">رزّة</title>
      <defs>
        <radialGradient id="background" cx="44%" cy="30%" r="82%">
          <stop offset="0" stop-color="#4A2418" />
          <stop offset="0.48" stop-color="#2F1713" />
          <stop offset="1" stop-color="#1C1417" />
        </radialGradient>
        <linearGradient id="copper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#DEA276" />
          <stop offset="0.55" stop-color="#C98256" />
          <stop offset="1" stop-color="#A45F3D" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#background)" />
      <path fill="url(#copper)" d="\(symbol.path)" transform="\(fittedTransform(for: symbol, targetWidth: targetWidth, x: x, y: y))" />
    </svg>
    """
}

guard CommandLine.arguments.count == 4 else {
    fputs("Usage: generateApprovedBrandAssets.swift <arabic-font.ttf> <latin-font.ttf> <output-directory>\n", stderr)
    exit(64)
}

let arabicFontPath = CommandLine.arguments[1]
let latinFontPath = CommandLine.arguments[2]
let outputDirectory = URL(fileURLWithPath: CommandLine.arguments[3], isDirectory: true)

do {
    try registerFont(at: arabicFontPath)
    try registerFont(at: latinFontPath)
    try FileManager.default.createDirectory(at: outputDirectory, withIntermediateDirectories: true)

    let arabic = outline(text: "رزّة", postScriptName: "ArefRuqaa-Regular", pointSize: 128)
    let symbol = outline(text: "زّ", postScriptName: "ArefRuqaa-Regular", pointSize: 128)
    let latin = outline(text: "RIZZA", postScriptName: "BodoniModa-Regular", pointSize: 42, tracking: 8)

    let files = [
        "rizza-primary-light.svg": lockupSVG(arabic: arabic, latin: latin, arabicColor: "#C98256", latinColor: "#FFF9F2"),
        "rizza-primary-dark.svg": lockupSVG(arabic: arabic, latin: latin, arabicColor: "#8E4F34", latinColor: "#27131D"),
        "rizza-primary-monochrome.svg": lockupSVG(arabic: arabic, latin: latin, arabicColor: "#15120F", latinColor: "#15120F"),
        "rizza-app-icon.svg": appIconSVG(arabic: arabic, latin: latin),
        "rizza-symbol.svg": symbolIconSVG(symbol: symbol),
        "rizza-mark-monochrome.svg": monochromeMarkSVG(symbol: symbol),
    ]

    for (filename, contents) in files {
        try contents.write(to: outputDirectory.appendingPathComponent(filename), atomically: true, encoding: .utf8)
    }
} catch {
    fputs("Brand asset generation failed: \(error.localizedDescription)\n", stderr)
    exit(1)
}
