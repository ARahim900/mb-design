import { copy, localize } from '../../data/content';
import { findGovernorate, governorates } from '../../data/oman';
import type { Locale } from '../../types';
import { MobileField, SelectField, TextField } from './FormFields';
import type { CheckoutDetails, CheckoutErrors, CheckoutField } from './order';

interface DetailsFormProps {
  readonly locale: Locale;
  readonly details: CheckoutDetails;
  readonly errors: CheckoutErrors;
  readonly onChange: (field: CheckoutField, value: string) => void;
}

export function DetailsForm({ locale, details, errors, onChange }: DetailsFormProps) {
  const checkoutCopy = copy.checkout;
  const governorate = findGovernorate(details.governorate);
  const governorateOptions = governorates.map((item) => ({ value: item.id, label: localize(item.name, locale) }));
  const wilayatOptions = (governorate?.wilayats ?? []).map((item) => ({
    value: item.id,
    label: localize(item.name, locale),
  }));

  return (
    <div className="space-y-8">
      <fieldset className="space-y-5">
        <legend className="mb-4 text-xs font-medium uppercase tracking-editorial text-copper-deep">
          {localize(checkoutCopy.contact, locale)}
        </legend>
        <TextField
          id="checkout-name"
          name="name"
          label={localize(checkoutCopy.name, locale)}
          locale={locale}
          value={details.name}
          autoComplete="name"
          error={errors.name}
          onChange={(value) => onChange('name', value)}
        />
        <MobileField
          id="checkout-mobile"
          label={localize(checkoutCopy.mobile, locale)}
          hint={localize(checkoutCopy.mobileHelp, locale)}
          locale={locale}
          value={details.mobile}
          error={errors.mobile}
          onChange={(value) => onChange('mobile', value)}
        />
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-4 text-xs font-medium uppercase tracking-editorial text-copper-deep">
          {localize(checkoutCopy.address, locale)}
        </legend>
        <SelectField
          id="checkout-governorate"
          name="governorate"
          label={localize(checkoutCopy.governorate, locale)}
          locale={locale}
          value={details.governorate}
          placeholder={localize(checkoutCopy.choose, locale)}
          options={governorateOptions}
          autoComplete="address-level1"
          error={errors.governorate}
          onChange={(value) => onChange('governorate', value)}
        />
        <SelectField
          id="checkout-wilayat"
          name="wilayat"
          label={localize(checkoutCopy.wilayat, locale)}
          locale={locale}
          value={details.wilayat}
          placeholder={localize(governorate ? checkoutCopy.choose : checkoutCopy.chooseGovernorateFirst, locale)}
          options={wilayatOptions}
          autoComplete="address-level2"
          error={errors.wilayat}
          disabled={!governorate}
          onChange={(value) => onChange('wilayat', value)}
        />
        <TextField
          id="checkout-area"
          name="area"
          label={localize(checkoutCopy.area, locale)}
          locale={locale}
          value={details.area}
          autoComplete="address-level3"
          error={errors.area}
          onChange={(value) => onChange('area', value)}
        />
        <TextField
          id="checkout-street"
          name="street"
          label={localize(checkoutCopy.street, locale)}
          locale={locale}
          value={details.street}
          autoComplete="address-line1"
          optional
          onChange={(value) => onChange('street', value)}
        />
        <TextField
          id="checkout-house"
          name="house"
          label={localize(checkoutCopy.house, locale)}
          locale={locale}
          value={details.house}
          autoComplete="address-line2"
          error={errors.house}
          onChange={(value) => onChange('house', value)}
        />
      </fieldset>
    </div>
  );
}
