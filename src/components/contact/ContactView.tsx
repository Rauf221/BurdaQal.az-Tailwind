"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Check, Mail, MapPin, Phone } from "lucide-react";
import {
  getContactMapExternalUrl,
  getContactQuery,
  useContactFormMutation,
} from "@/services/client/contact";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/motion";
import { toast } from "@/lib/toast";

export default function ContactView() {
  const locale = useLocale();
  const t = useTranslations("contact");
  const { data } = useQuery(getContactQuery(locale));
  const contact = data?.data;
  const mapLink = getContactMapExternalUrl(contact);

  const contactMutation = useContactFormMutation(locale);

  const addressText = contact?.address?.trim() || t("fallbackAddress");
  const phoneText = contact?.phone?.trim() || t("fallbackPhone");
  const emailText = contact?.email?.trim() || t("fallbackEmail");

  const onSubmitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const note = String(fd.get("note") || "").trim();
    try {
      await contactMutation.mutateAsync({ name, email, phone, note });
      toast.success(t("success"));
      form.reset();
    } catch {
      toast.error(t("error"));
    }
  };

  const fieldCls =
    "w-full rounded-xl border border-[#E1E1E1] bg-[var(--White)] px-[18px] py-3 text-[15px] font-normal leading-7 text-[var(--Secondary)] outline-none placeholder:text-[var(--Secondary)] focus:border-[var(--Secondary)] focus:placeholder-transparent";

  return (
    <div>
      <FadeIn>
        <div className="wrap-map-v5 relative pb-0 max-md:pb-0 min-[992px]:pb-[193px]">
        <div className="row-height relative h-[570px] min-h-[570px] w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/Contact/ContactBanner.jpg"
            alt={t("bannerAlt")}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>
        <FadeInStagger className="grid-contact relative mx-auto flex w-full max-w-[1190px] flex-wrap gap-10 px-4 pt-5 min-[992px]:absolute min-[992px]:bottom-0 min-[992px]:left-1/2 min-[992px]:-translate-x-1/2 min-[992px]:flex-nowrap min-[992px]:px-4 min-[992px]:pt-0">
          <FadeInStaggerItem className="contact-item min-h-[385px] w-full min-w-0 flex-1 rounded-3xl bg-[var(--White)] px-[30px] py-[30px] text-center text-[var(--Secondary)] shadow-[0px_6px_15px_0px_#404F680D] min-[551px]:px-[50px] min-[551px]:py-[60px]">
            <div className="icon mx-auto mb-[22px] flex h-20 w-20 items-center justify-center rounded-full bg-[#F9F9F9]">
              <MapPin className="h-9 w-9 text-[var(--Secondary)]" strokeWidth={1.25} />
            </div>
            <div className="content min-h-[100px]">
              <h4 className="mb-[14px] text-[17px] font-medium leading-7 text-[var(--Secondary)]">
                {t("addressTitle")}
              </h4>
              <p className="text-[15px] font-normal leading-7 text-[var(--Text)] whitespace-pre-line">
                {addressText}
              </p>
            </div>
            <div className="bot mt-[21px] border-t border-[var(--Border)] pt-[23px]">
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-content text-[16px] font-normal leading-6 text-[var(--Secondary)] hover:underline"
              >
                {t("openInMaps")}
              </a>
            </div>
          </FadeInStaggerItem>
          <FadeInStaggerItem className="contact-item min-h-[385px] w-full min-w-0 flex-1 rounded-3xl bg-[var(--White)] px-[30px] py-[30px] text-center text-[var(--Secondary)] shadow-[0px_6px_15px_0px_#404F680D] min-[551px]:px-[50px] min-[551px]:py-[60px]">
            <div className="icon mx-auto mb-[22px] flex h-20 w-20 items-center justify-center rounded-full bg-[#F9F9F9]">
              <Phone className="h-9 w-9 text-[var(--Secondary)]" strokeWidth={1.25} />
            </div>
            <div className="content min-h-[100px]">
              <h4 className="mb-[14px] text-[17px] font-medium leading-7 text-[var(--Secondary)]">
                {t("phoneTitle")}
              </h4>
              <p className="text-[15px] font-normal leading-7 text-[var(--Text)]">
                {phoneText}
              </p>
            </div>
            <div className="bot mt-[21px] border-t border-[var(--Border)] pt-[23px]">
              <a
                href={`tel:${phoneText.replace(/\s/g, "")}`}
                className="text-content text-[16px] font-normal leading-6 text-[var(--Secondary)] hover:underline"
              >
                {t("call")}
              </a>
            </div>
          </FadeInStaggerItem>
          <FadeInStaggerItem className="contact-item min-h-[385px] w-full min-w-0 flex-1 rounded-3xl bg-[var(--White)] px-[30px] py-[30px] text-center text-[var(--Secondary)] shadow-[0px_6px_15px_0px_#404F680D] min-[551px]:px-[50px] min-[551px]:py-[60px]">
            <div className="icon mx-auto mb-[22px] flex h-20 w-20 items-center justify-center rounded-full bg-[#F9F9F9]">
              <Mail className="h-9 w-9 text-[var(--Secondary)]" strokeWidth={1.25} />
            </div>
            <div className="content min-h-[100px]">
              <h4 className="mb-[14px] text-[17px] font-medium leading-7 text-[var(--Secondary)]">
                {t("emailTitle")}
              </h4>
              <p className="text-[15px] font-normal leading-7 text-[var(--Text)]">
                {emailText}
              </p>
            </div>
            <div className="bot mt-[21px] border-t border-[var(--Border)] pt-[23px]">
              <a
                href={`mailto:${emailText}`}
                className="text-content text-[16px] font-normal leading-6 text-[var(--Secondary)] hover:underline"
              >
                {t("writeEmail")}
              </a>
            </div>
          </FadeInStaggerItem>
        </FadeInStagger>
      </div>
      </FadeIn>

      <FadeIn as="section" className="tf-section send-message block pt-[120px] pb-[120px] min-[992px]:pb-[196px] min-[992px]:pt-[200px]">
        <div className="themesflat-container mx-auto w-full max-w-[1428px] px-[14px]">
          <div className="heading-section mx-auto mb-[35px] text-center">
            <h2 className="-mt-2 mb-4 text-[40px] font-semibold leading-[47px] text-[var(--Secondary)]">
              {t("formTitle")}
            </h2>
            <div className="text text-[17px] font-normal leading-5 text-[var(--Text)]">
              {t("formSubtitle")}
            </div>
          </div>
          <div className="mx-auto w-full max-w-[920px]">
            <form
              className="form-send-message flex flex-col gap-[30px]"
              onSubmit={onSubmitMessage}
            >
              <div className="cols flex w-full flex-col gap-[30px] min-[768px]:flex-row min-[768px]:gap-[30px] [&>*]:min-[768px]:w-1/2">
                <fieldset className="has-top-title relative m-0 min-w-0 border-0 p-0">
                  <input
                    id="contact-name"
                    type="text"
                    placeholder={t("name")}
                    name="name"
                    tabIndex={2}
                    aria-required="true"
                    required
                    className={`peer ${fieldCls}`}
                  />
                  <label
                    htmlFor="contact-name"
                    className="pointer-events-none absolute left-[10px] top-0 z-[3] -translate-y-1/2 bg-[var(--White)] px-2.5 text-[15px] font-normal leading-[15px] text-[var(--Secondary)] opacity-0 transition-opacity peer-placeholder-shown:opacity-0 peer-focus:opacity-100 peer-valid:opacity-100"
                  >
                    {t("name")}
                  </label>
                </fieldset>
                <fieldset className="has-top-title relative m-0 min-w-0 border-0 p-0">
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder={t("phone")}
                    name="phone"
                    tabIndex={2}
                    aria-required="true"
                    required
                    className={`peer ${fieldCls}`}
                  />
                  <label
                    htmlFor="contact-phone"
                    className="pointer-events-none absolute left-[10px] top-0 z-[3] -translate-y-1/2 bg-[var(--White)] px-2.5 text-[15px] font-normal leading-[15px] text-[var(--Secondary)] opacity-0 transition-opacity peer-placeholder-shown:opacity-0 peer-focus:opacity-100 peer-valid:opacity-100"
                  >
                    {t("phone")}
                  </label>
                </fieldset>
              </div>
              <fieldset className="has-top-title relative m-0 min-w-0 border-0 p-0">
                <input
                  id="contact-email"
                  type="email"
                  placeholder={t("email")}
                  name="email"
                  tabIndex={2}
                  aria-required="true"
                  required
                  className={`peer ${fieldCls}`}
                />
                <label
                  htmlFor="contact-email"
                  className="pointer-events-none absolute left-[10px] top-0 z-[3] -translate-y-1/2 bg-[var(--White)] px-2.5 text-[15px] font-normal leading-[15px] text-[var(--Secondary)] opacity-0 transition-opacity peer-placeholder-shown:opacity-0 peer-focus:opacity-100 peer-valid:opacity-100"
                >
                  {t("email")}
                </label>
              </fieldset>
              <fieldset className="has-top-title relative m-0 min-w-0 border-0 p-0">
                <textarea
                  id="contact-note"
                  name="note"
                  rows={4}
                  placeholder={t("message")}
                  tabIndex={2}
                  aria-required="true"
                  required
                  defaultValue=""
                  className={`peer min-h-[230px] resize-y ${fieldCls}`}
                />
                <label
                  htmlFor="contact-note"
                  className="pointer-events-none absolute left-[10px] top-[11px] z-[3] -translate-y-1/2 bg-[var(--White)] px-2.5 text-[15px] font-normal leading-[15px] text-[var(--Secondary)] opacity-0 transition-opacity peer-placeholder-shown:opacity-0 peer-focus:opacity-100 peer-valid:opacity-100"
                >
                  {t("message")}
                </label>
              </fieldset>
              <div className="checkbox-item -mb-[5px] -mt-[3px]">
                <label className="relative flex cursor-pointer items-start gap-3 pl-0">
                  <input type="checkbox" name="consent" required className="peer sr-only" />
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-[#9ea4ad] peer-checked:border-[var(--Secondary)] peer-checked:bg-[var(--Secondary)] [&_svg]:opacity-0 peer-checked:[&_svg]:opacity-100">
                    <Check
                      className="h-3 w-3 text-[var(--White)]"
                      strokeWidth={3}
                      aria-hidden
                    />
                  </span>
                  <p className="m-0 text-left text-[15px] font-normal leading-6 text-[var(--Secondary)]">
                    {t("consent")}
                  </p>
                </label>
              </div>
              <div className="button-submit">
                <button
                  className="tf-button-primary inline-flex w-full max-w-none items-center justify-center gap-2.5 rounded-xl border-0 bg-[var(--Primary)] px-[26px] py-[18px] text-[15px] font-medium leading-[18px] text-[var(--White)] transition-colors hover:bg-[#6fb042] disabled:opacity-60"
                  type="submit"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? t("submitting") : t("submit")}
                  <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
