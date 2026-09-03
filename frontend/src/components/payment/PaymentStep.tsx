"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useForm, type UseFormSetValue } from "react-hook-form";
import { Check, CreditCard, MapPin, Wallet } from "lucide-react";

type PaymentMethod = "google" | "apple" | "card";

type CardFields = {
  name: string;
  number: string;
  expiry: string;
  cvc: string;
};

export type PaymentStepHandle = {
  submit: () => void;
};

type PaymentStepProps = {
  paymentMethod: PaymentMethod;
  card: CardFields;
  billingSame: boolean;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onCardChange: (card: CardFields) => void;
  onBillingSameChange: (same: boolean) => void;
  onValid: () => void;
};

function cardBrand(number: string) {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("4")) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "MC";
  return "CARD";
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 4)
    .replace(/(\d{2})(\d)/, "$1 / $2");
}

export const PaymentStep = forwardRef<PaymentStepHandle, PaymentStepProps>(
  function PaymentStep(
    {
      paymentMethod,
      card,
      billingSame,
      onPaymentMethodChange,
      onCardChange,
      onBillingSameChange,
      onValid,
    },
    ref,
  ) {
    const form = useForm<CardFields>({ defaultValues: card, mode: "onBlur" });
    const reduceMotion = useReducedMotion();
    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
      watch,
    } = form;

    useEffect(() => {
      const subscription = watch((values) => {
        onCardChange({
          name: values.name ?? "",
          number: values.number ?? "",
          expiry: values.expiry ?? "",
          cvc: values.cvc ?? "",
        });
      });
      return () => subscription.unsubscribe();
    }, [onCardChange, watch]);

    useImperativeHandle(
      ref,
      () => ({ submit: () => void handleSubmit(onValid)() }),
      [handleSubmit, onValid],
    );

    function updateFormatted(
      field: keyof CardFields,
      value: string,
      formatter: (input: string) => string,
      setFormValue: UseFormSetValue<CardFields>,
    ) {
      setFormValue(field, formatter(value), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    return (
      <>
        <section className="space-y-5">
          <div>
            <h2 className="heading-font text-foreground text-3xl">
              Payment Method
            </h2>
            <p className="text-text-muted mt-1">
              Choose how you&apos;d like to pay.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <PaymentOption
              selected={paymentMethod === "google"}
              onClick={() => onPaymentMethodChange("google")}
              icon={<Wallet className="size-4" />}
              label="Google Pay"
              detail="Wallet"
            />
            <PaymentOption
              selected={paymentMethod === "apple"}
              onClick={() => onPaymentMethodChange("apple")}
              icon={<Wallet className="size-4" />}
              label="Apple Pay"
              detail="Wallet"
            />
            <PaymentOption
              selected={paymentMethod === "card"}
              onClick={() => onPaymentMethodChange("card")}
              icon={<CreditCard className="size-4" />}
              label="Credit / Debit Card"
              detail="Visa · Mastercard"
              wide
            />
          </div>
        </section>

        <AnimatePresence mode="wait" initial={false}>
          {paymentMethod === "card" && (
            <motion.section
              key="card-form"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="bg-surface-1 rounded-xl border border-(--outline-strong)/70 p-5 sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="heading-font text-foreground text-lg">
                    Card details
                  </h3>
                  <p className="text-text-muted mt-1 text-xs">
                    Demo payment form. Card data is never submitted.
                  </p>
                </div>
                <span className="meta-font text-primary-soft text-xs">
                  {cardBrand(card.number)}
                </span>
              </div>
              <div className="grid gap-4">
                <Field label="Cardholder Name" error={errors.name?.message}>
                  <input
                    {...register("name", {
                      required: "Enter the cardholder name.",
                    })}
                    className="form-input min-h-11"
                    placeholder="Hanae Mori"
                    autoComplete="cc-name"
                  />
                </Field>
                <Field label="Card Number" error={errors.number?.message}>
                  <div className="relative">
                    <input
                      {...register("number", {
                        required: "Enter a valid card number.",
                        validate: (value) =>
                          value.replace(/\D/g, "").length >= 13 ||
                          "Enter a valid card number.",
                      })}
                      onChange={(event) =>
                        updateFormatted(
                          "number",
                          event.target.value,
                          formatCardNumber,
                          setValue,
                        )
                      }
                      className="form-input min-h-11 pr-11"
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      autoComplete="cc-number"
                    />
                    <CreditCard className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-(--outline)" />
                  </div>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Expiry Date" error={errors.expiry?.message}>
                    <input
                      {...register("expiry", {
                        required: "Use MM / YY.",
                        pattern: {
                          value: /^\d{2}\s*\/\s*\d{2}$/,
                          message: "Use MM / YY.",
                        },
                      })}
                      onChange={(event) =>
                        updateFormatted(
                          "expiry",
                          event.target.value,
                          formatExpiry,
                          setValue,
                        )
                      }
                      className="form-input min-h-11"
                      inputMode="numeric"
                      placeholder="MM / YY"
                      autoComplete="cc-exp"
                    />
                  </Field>
                  <Field label="CVC" error={errors.cvc?.message}>
                    <input
                      {...register("cvc", {
                        required: "Enter a valid CVC.",
                        pattern: {
                          value: /^\d{3,4}$/,
                          message: "Enter a valid CVC.",
                        },
                      })}
                      className="form-input min-h-11"
                      inputMode="numeric"
                      placeholder="123"
                      autoComplete="cc-csc"
                    />
                  </Field>
                </div>
                <label className="text-text-muted flex min-h-11 items-center gap-2 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    className="accent-primary-soft size-4"
                  />
                  Securely save card for future purchases
                </label>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <section className="bg-surface-1 rounded-xl border border-(--outline-strong)/70 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <MapPin className="text-primary-soft mt-0.5 size-5" />
            <div className="flex-1">
              <h3 className="heading-font text-foreground text-lg">
                Billing Address
              </h3>
              <div className="mt-3 grid gap-2 text-sm">
                <label className="text-foreground flex min-h-11 items-center gap-3">
                  <input
                    type="radio"
                    checked={billingSame}
                    onChange={() => onBillingSameChange(true)}
                    name="billing"
                    className="accent-primary-soft"
                  />
                  Same as shipping address
                </label>
                <label className="text-text-muted flex min-h-11 items-center gap-3">
                  <input
                    type="radio"
                    checked={!billingSame}
                    onChange={() => onBillingSameChange(false)}
                    name="billing"
                    className="accent-primary-soft"
                  />
                  Use a different billing address
                </label>
              </div>
              <AnimatePresence initial={false}>
                {!billingSame && (
                  <motion.div
                    initial={
                      reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="mt-3"
                  >
                    <input
                      className="form-input min-h-11"
                      placeholder="Enter billing address"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </>
    );
  },
);

function PaymentOption({
  selected,
  onClick,
  icon,
  label,
  detail,
  wide = false,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  detail: string;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-amber flex min-h-16 items-center gap-3 rounded-lg border p-4 text-left transition ${wide ? "sm:col-span-2" : ""} ${selected ? "border-primary-soft bg-primary-soft/8 shadow-[0_0_0_1px_rgba(255,183,122,0.18)]" : "bg-surface-1 border-(--outline-strong) hover:border-(--outline)"}`}
    >
      <span className={selected ? "text-primary-soft" : "text-text-muted"}>
        {icon}
      </span>
      <span className="flex-1">
        <span className="text-foreground block text-sm font-medium">
          {label}
        </span>
        <span className="text-text-muted mt-0.5 block text-xs">{detail}</span>
      </span>
      {selected && <Check className="text-primary-soft size-4" />}
    </button>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="meta-font text-text-muted mb-2 block text-xs">
        {label}
      </span>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1 block overflow-hidden text-xs text-red-200"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}
