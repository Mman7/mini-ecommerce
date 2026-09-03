"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckIcon,
  CreditCard,
  LoaderCircleIcon,
  Lock,
  Truck,
} from "lucide-react";
import { getCart, type Cart, type CartItem } from "@/src/api/cart.api";
import { createOrder } from "@/src/api/order.api";
import {
  getAddresses,
  getCurrentUser,
  type SavedAddress,
  type User,
} from "@/src/api/user.api";
import {
  PaymentStep,
  type PaymentStepHandle,
} from "@/src/components/payment/PaymentStep";
import { PaymentLoadState } from "@/src/types/payment-load-state.enum";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/src/components/reui/stepper";

const checkoutSteps = ["Shipping", "Payment", "Review"];
const shippingCost = 500;
const fallbackImage = "/homepage/white-plush-rabbit-on-shelf.png";
type PaymentMethod = "google" | "apple" | "card";
type CardFields = { name: string; number: string; expiry: string; cvc: string };

function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}
function price(value: string | number) {
  return typeof value === "number" ? value : Number(value);
}
function itemImage(item: CartItem) {
  return (
    item.product.productImages.find((image) => image.isThumbnail)?.url ||
    item.product.productImages[0]?.url ||
    fallbackImage
  );
}

export default function PaymentPage() {
  const router = useRouter();
  const paymentFormRef = useRef<PaymentStepHandle>(null);
  const [loadState, setLoadState] = useState(PaymentLoadState.Loading);
  const [loadError, setLoadError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState<CardFields>({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  });
  const [billingSame, setBillingSame] = useState(true);
  const [action, setAction] = useState<"idle" | "processing" | "success">(
    "idle",
  );
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all([getCurrentUser(), getAddresses(), getCart()])
      .then(([userResponse, addressResponse, cartResponse]) => {
        if (!mounted) return;
        setUser(userResponse.user);
        setAddresses(addressResponse.addresses);
        setSelectedAddressId(addressResponse.addresses[0]?.id ?? null);
        setCart(
          Array.isArray(cartResponse)
            ? { userId: userResponse.user.userId, items: [] }
            : cartResponse,
        );
        setLoadState(PaymentLoadState.Ready);
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        if ((error as { status?: number }).status === 401)
          setLoadState(PaymentLoadState.Unauthorized);
        else {
          setLoadError(
            error instanceof Error ? error.message : "Unable to load checkout.",
          );
          setLoadState(PaymentLoadState.Error);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const items = cart?.items ?? [];
  const address =
    addresses.find((candidate) => candidate.id === selectedAddressId) ?? null;
  const subtotal = items.reduce(
    (sum, item) => sum + price(item.product.price) * item.quantity,
    0,
  );
  const total = subtotal + shippingCost;
  const isProcessing = action === "processing";

  function goToStep(step: number) {
    if (
      step === currentStep ||
      step < 1 ||
      (step > currentStep && !completedSteps.includes(step))
    )
      return;
    setDirection(step > currentStep ? "forward" : "backward");
    setCurrentStep(step);
  }
  function completeStep(step: number) {
    setCompletedSteps((previous) => [...new Set([...previous, step])]);
    setDirection("forward");
    setCurrentStep(step + 1);
  }
  async function continueShipping() {
    if (!address) {
      setActionError("Select a delivery address before continuing.");
      return;
    }
    setActionError("");
    setAction("processing");
    await new Promise((resolve) => setTimeout(resolve, 450));
    setAction("idle");
    completeStep(1);
  }
  function continuePayment() {
    paymentFormRef.current?.submit();
  }
  async function submitPayment() {
    setActionError("");
    setAction("processing");
    await new Promise((resolve) => setTimeout(resolve, 450));
    setAction("idle");
    completeStep(2);
  }
  async function placeOrder() {
    if (!address || items.length === 0) return;
    setActionError("");
    setAction("processing");
    try {
      const response = await createOrder(
        items.map(({ productId, quantity }) => ({ productId, quantity })),
        address.id,
      );
      setAction("success");
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push(
        `/order-success?orderId=${encodeURIComponent(response.order.id)}`,
      );
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to place this order.",
      );
      setAction("idle");
    }
  }

  if (loadState === PaymentLoadState.Loading)
    return (
      <CheckoutMessage
        title="Preparing your checkout"
        detail="Loading your selection and delivery details."
      />
    );
  if (loadState === PaymentLoadState.Unauthorized)
    return (
      <CheckoutMessage
        title="Sign in to continue"
        detail="Your checkout is connected to your account."
        actionLabel="Go to login"
        onAction={() => router.push("/login")}
      />
    );
  if (loadState === PaymentLoadState.Error)
    return (
      <CheckoutMessage
        title="Checkout unavailable"
        detail={loadError}
        actionLabel="Try again"
        onAction={() => window.location.reload()}
      />
    );
  if (items.length === 0)
    return (
      <CheckoutMessage
        title="Your cart is empty"
        detail="Add something special before starting checkout."
        actionLabel="Browse products"
        onAction={() => router.push("/products")}
      />
    );

  const actionLabel =
    currentStep === 1
      ? "Continue to Payment"
      : currentStep === 2
        ? "Continue to Review"
        : `Place Order · ${formatYen(total)}`;
  return (
    <main className="min-h-dvh pb-20">
      <section className="padding-inline bg-surface-1 mt-17 border-b border-(--outline-strong)/50 py-14 sm:py-18">
        <div className="animate-checkout-in mx-auto max-w-7xl">
          <p className="meta-font text-primary-soft text-xs tracking-[0.2em] uppercase">
            Checkout Session
          </p>
          <h1 className="heading-font text-foreground mt-3 text-4xl font-semibold sm:text-5xl">
            Review Your Order
          </h1>
          <p className="text-text-muted mt-3 max-w-xl text-sm sm:text-base">
            Complete your purchase in just a few simple steps.
          </p>
        </div>
      </section>
      <section className="padding-inline mx-auto mt-8 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(300px,0.9fr)] lg:items-start">
          <div>
            <Stepper
              value={currentStep}
              onValueChange={goToStep}
              indicators={{
                completed: <CheckIcon className="size-3.5" />,
                loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
              }}
              className="w-full space-y-8"
            >
              <StepperNav className="w-full gap-2 sm:gap-8">
                {checkoutSteps.map((title, index) => {
                  const step = index + 1;
                  const completed = completedSteps.includes(step);
                  return (
                    <StepperItem
                      key={title}
                      step={step}
                      completed={completed}
                      disabled={step > currentStep && !completed}
                      className="relative min-w-0 flex-1 items-start"
                    >
                      <StepperTrigger className="flex min-h-11 flex-col gap-2.5 disabled:cursor-not-allowed">
                        <StepperIndicator className="data-[state=completed]:border-primary-soft data-[state=completed]:bg-primary-soft data-[state=completed]:text-primary-foreground data-[state=active]:border-primary-soft data-[state=active]:bg-surface-3 data-[state=active]:text-primary-soft data-[state=inactive]:bg-surface-1 size-8 border-2 transition-transform duration-300 data-[state=inactive]:border-(--outline-strong) data-[state=inactive]:text-(--outline)">
                          {step}
                        </StepperIndicator>
                        <StepperTitle className="heading-font text-primary-soft text-sm font-semibold group-data-[state=inactive]/step:text-(--outline) sm:text-base">
                          {title}
                        </StepperTitle>
                      </StepperTrigger>
                      {step < 3 && (
                        <StepperSeparator className="group-data-[state=completed]/step:bg-primary-soft absolute top-4 right-0 left-[calc(50%+1.25rem)] z-0 m-0 h-0.5 sm:left-[calc(50%+1.5rem)]" />
                      )}
                    </StepperItem>
                  );
                })}
              </StepperNav>
              <StepperPanel
                className={
                  direction === "forward"
                    ? "animate-step-forward text-sm"
                    : "animate-step-backward text-sm"
                }
              >
                <StepperContent value={1} className="space-y-6">
                  <ShippingStep
                    user={user}
                    addresses={addresses}
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={setSelectedAddressId}
                  />
                </StepperContent>
                <StepperContent value={2} className="space-y-6">
                  <PaymentStep
                    ref={paymentFormRef}
                    paymentMethod={paymentMethod}
                    card={card}
                    billingSame={billingSame}
                    onPaymentMethodChange={setPaymentMethod}
                    onCardChange={setCard}
                    onBillingSameChange={setBillingSame}
                    onValid={submitPayment}
                  />
                </StepperContent>
                <StepperContent value={3} className="space-y-6">
                  <ReviewStep
                    address={address}
                    user={user}
                    paymentMethod={paymentMethod}
                    card={card}
                    items={items}
                    onEditShipping={() => goToStep(1)}
                    onEditPayment={() => goToStep(2)}
                  />
                </StepperContent>
              </StepperPanel>
            </Stepper>
            {actionError && (
              <p className="mt-5 rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {actionError}
              </p>
            )}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 1 || isProcessing}
                className="text-text-muted focus-amber hover:text-foreground inline-flex min-h-11 items-center justify-center gap-2 px-3 text-sm disabled:opacity-40"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
              <button
                type="button"
                onClick={
                  currentStep === 1
                    ? continueShipping
                    : currentStep === 2
                      ? continuePayment
                      : placeOrder
                }
                disabled={isProcessing || (currentStep === 1 && !address)}
                className="focus-amber bg-primary-soft hover:bg-primary text-primary-foreground inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <LoaderCircleIcon className="size-4 animate-spin" />
                    Processing...
                  </>
                ) : action === "success" ? (
                  <>
                    <Check className="size-4" />
                    Order Confirmed
                  </>
                ) : (
                  <>
                    {actionLabel}
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>
          </div>
          <OrderSummary items={items} subtotal={subtotal} total={total} />
        </div>
      </section>
    </main>
  );
}

function CheckoutMessage({
  title,
  detail,
  actionLabel,
  onAction,
}: {
  title: string;
  detail: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <main className="padding-inline flex min-h-dvh items-center justify-center">
      <section className="bg-surface-1 w-full max-w-lg rounded-xl border border-(--outline-strong) p-8 text-center">
        <h1 className="heading-font text-foreground text-2xl">{title}</h1>
        <p className="text-text-muted mt-3 text-sm">{detail}</p>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="bg-primary-soft text-primary-foreground focus-amber mt-6 min-h-11 rounded-lg px-5 text-sm font-semibold"
          >
            {actionLabel}
          </button>
        )}
      </section>
    </main>
  );
}

function ShippingStep({
  user,
  addresses,
  selectedAddressId,
  onSelectAddress,
}: {
  user: User | null;
  addresses: SavedAddress[];
  selectedAddressId: number | null;
  onSelectAddress: (id: number) => void;
}) {
  return (
    <section className="bg-surface-1 rounded-xl border border-(--outline-strong)/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="heading-font text-primary-soft flex items-center gap-2 text-2xl">
            <Truck className="size-5" />
            Shipping Details
          </h2>
          <p className="text-text-muted mt-1 text-sm">
            Confirmed delivery location
          </p>
        </div>
        <span className="meta-font text-tertiary text-xs uppercase">
          Step 1 of 3
        </span>
      </div>
      {addresses.length ? (
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <button
              key={address.id}
              type="button"
              onClick={() => onSelectAddress(address.id)}
              className={`rounded-lg border p-4 text-left transition ${selectedAddressId === address.id ? "border-primary-soft bg-primary-soft/8" : "bg-surface-2 border-(--outline-strong) hover:border-(--outline)"}`}
            >
              <span className="meta-font text-xs text-(--outline) uppercase">
                {selectedAddressId === address.id
                  ? "Selected address"
                  : "Delivery address"}
              </span>
              <p className="text-foreground mt-2 font-medium">{user?.name}</p>
              <p className="text-text-muted mt-1 text-sm">
                {address.addressLine}
              </p>
              <p className="text-text-muted text-sm">
                {address.city}, {address.postalCode}
              </p>
              <p className="text-text-muted text-sm">{address.country}</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-text-muted bg-surface-2 mt-6 rounded-lg p-4">
          Add a saved address in your profile before continuing.
        </p>
      )}
      <div className="mt-6 grid gap-5 border-t border-(--outline-strong)/50 pt-5 sm:grid-cols-2">
        <div>
          <p className="meta-font text-xs text-(--outline) uppercase">
            Contact
          </p>
          <p className="text-foreground mt-2">{user?.email}</p>
          <p className="text-text-muted mt-1 text-sm">
            {user?.phoneNumber || "No phone number saved"}
          </p>
        </div>
        <div>
          <p className="meta-font text-xs text-(--outline) uppercase">
            Delivery note
          </p>
          <p className="text-text-muted mt-2 text-sm">
            Atelier Standard · 3–5 business days
          </p>
        </div>
      </div>
    </section>
  );
}

function ReviewStep({
  address,
  user,
  paymentMethod,
  card,
  items,
  onEditShipping,
  onEditPayment,
}: {
  address: SavedAddress | null;
  user: User | null;
  paymentMethod: PaymentMethod;
  card: CardFields;
  items: CartItem[];
  onEditShipping: () => void;
  onEditPayment: () => void;
}) {
  const paymentLabel =
    paymentMethod === "card"
      ? `Card ending in ${card.number.replace(/\D/g, "").slice(-4) || "••••"}`
      : paymentMethod === "google"
        ? "Google Pay"
        : "Apple Pay";
  return (
    <>
      <ReviewBlock
        title="Shipping"
        icon={<Truck className="size-4" />}
        onEdit={onEditShipping}
      >
        <p className="text-foreground font-medium">{user?.name}</p>
        <p className="text-text-muted mt-1">
          {address?.city}, {address?.country}
        </p>
      </ReviewBlock>
      <ReviewBlock
        title="Payment"
        icon={<CreditCard className="size-4" />}
        onEdit={onEditPayment}
      >
        <p className="text-foreground font-medium">{paymentLabel}</p>
        <p className="text-text-muted mt-1">Demo payment authorization</p>
      </ReviewBlock>
      <section className="space-y-3">
        <h2 className="heading-font text-foreground text-2xl">Your Items</h2>
        {items.map((item) => (
          <article
            key={item.id}
            className="bg-surface-1 animate-review-item flex items-center gap-4 rounded-xl border border-(--outline-strong)/70 p-4"
          >
            <div className="bg-surface-3 relative size-16 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={itemImage(item)}
                alt={item.product.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="heading-font text-foreground truncate text-base">
                {item.product.name}
              </h3>
              <p className="text-text-muted text-xs">Qty: {item.quantity}</p>
            </div>
            <p className="title-font text-primary-soft text-base font-semibold">
              {formatYen(price(item.product.price) * item.quantity)}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}
function ReviewBlock({
  title,
  icon,
  onEdit,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-surface-1 rounded-xl border border-(--outline-strong)/70 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="heading-font text-primary-soft flex items-center gap-2 text-xl">
            {icon}
            {title}
          </h2>
          <div className="mt-4 text-sm">{children}</div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-tertiary focus-amber rounded px-2 py-1 text-sm hover:underline"
        >
          Edit
        </button>
      </div>
    </section>
  );
}
function OrderSummary({
  items,
  subtotal,
  total,
}: {
  items: CartItem[];
  subtotal: number;
  total: number;
}) {
  return (
    <aside className="lg:sticky lg:top-24">
      <section className="bg-surface-1 rounded-xl border border-(--outline-strong)/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-6">
        <div className="flex items-center justify-between border-b border-(--outline-strong)/55 pb-4">
          <div>
            <h2 className="heading-font text-primary-soft text-xl">
              Your Selection
            </h2>
            <p className="text-text-muted mt-1 text-xs">
              {items.reduce((count, item) => count + item.quantity, 0)} items in
              cart
            </p>
          </div>
          <div className="flex -space-x-2">
            {items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-surface-3 relative size-10 overflow-hidden rounded-md border-2 border-(--surface-1)"
              >
                <Image
                  src={itemImage(item)}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 space-y-3 text-sm">
          <div className="text-text-muted flex justify-between">
            <span>Subtotal</span>
            <span>{formatYen(subtotal)}</span>
          </div>
          <div className="text-text-muted flex justify-between">
            <span>Shipping</span>
            <span>{formatYen(shippingCost)}</span>
          </div>
          <div className="text-text-muted flex justify-between">
            <span>Gift Wrap</span>
            <span className="text-primary-soft">Free</span>
          </div>
          <div className="border-t border-(--outline-strong)/50 pt-4">
            <div className="flex items-end justify-between gap-3">
              <span className="heading-font text-foreground text-xl">
                Total
              </span>
              <span className="title-font text-primary-soft text-3xl">
                {formatYen(total)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-text-muted mt-6 flex items-start gap-2 border-t border-(--outline-strong)/50 pt-4 text-xs">
          <Lock className="text-tertiary mt-0.5 size-3.5 shrink-0" />
          <span>
            <strong className="text-foreground font-medium">
              Secure encrypted payment
            </strong>
            <br />
            Your payment information is protected.
          </span>
        </div>
      </section>
    </aside>
  );
}
