"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CreditCard, LoaderCircleIcon } from "lucide-react";

export type PaymentStepHandle = { submit: () => void };

type PaymentStepProps = {
  onValid: (paymentIntentId: string) => void;
  onError: (message: string) => void;
};

export const PaymentStep = forwardRef<PaymentStepHandle, PaymentStepProps>(
  function PaymentStep({ onValid, onError }, ref) {
    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        submit: () => {
          void (async () => {
            if (!stripe || !elements) {
              onError("Payment form is still loading. Try again in a moment.");
              return;
            }
            setIsSubmitting(true);
            const result = await stripe.confirmPayment({
              elements,
              redirect: "if_required",
            });
            setIsSubmitting(false);
            if (result.error) {
              onError(
                result.error.message ?? "Payment could not be confirmed.",
              );
              return;
            }
            if (result.paymentIntent) onValid(result.paymentIntent.id);
          })();
        },
      }),
      [elements, onError, onValid, stripe],
    );

    return (
      <section className="bg-surface-1 min-h-0 overflow-visible rounded-xl border border-(--outline-strong)/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="heading-font text-primary-soft flex items-center gap-2 text-2xl">
              <CreditCard className="size-5" />
              Payment details
            </h2>
            <p className="text-text-muted mt-1 text-sm">
              Your card details are securely handled by Stripe.
            </p>
          </div>
          {isSubmitting && <LoaderCircleIcon className="size-5 animate-spin" />}
        </div>
        <div
          className="min-h-0 touch-pan-y overflow-visible"
          data-native-scroll
        >
          <PaymentElement options={{ layout: "tabs" }} />
        </div>
      </section>
    );
  },
);
