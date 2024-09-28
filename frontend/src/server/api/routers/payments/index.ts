
import {
  createTRPCRouter,
} from "~/server/api/trpc";

// import emailTemplate from "~/email-template.html";
import getPaymentLink from "./_lib/controllers/get-payment-link";
import legalSignUp from "./_lib/controllers/legal-sign-up";

export const paymentRouder = createTRPCRouter({
  getPaymentLink: getPaymentLink,
  legalSignUp: legalSignUp
})



