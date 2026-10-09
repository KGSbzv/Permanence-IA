// Text of the emails sent by the site, in English (United Kingdom and Australia): shared footer, email
// preferences page (/preferences-email) and the email carrying the personal preferences link.
// Footer: {year}, {company}, {brand} and {email} are filled in when sending (src/lib/emailFooter.ts).
import type { UI_EMAIL as FR_UI_EMAIL } from '../../fr/ui/email';

export const UI_EMAIL: typeof FR_UI_EMAIL = {
  footer: {
    copyright: 'Copyright © {year} {company}, All rights reserved.',
    brandOf: '{brand} is a brand of {company}.',
    question: 'Want to change how you receive these emails?',
    manage: ['You can manage your email preferences for {email} ', 'here', ''],
    manageNoEmail: ['You can manage your email preferences ', 'here', ''],
    unsubscribe: ['or you can unsubscribe from all emails ', 'here', '.'],
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
  },
  prefs: {
    meta: {
      title: (brand: string) => `Email preferences · ${brand}`,
      description: 'Choose which emails you receive from us, or unsubscribe from non-essential emails.',
    },
    h1: 'Your email preferences',
    intro: (brand: string) => `Choose which emails you receive from ${brand}.`,
    address: 'Email address',
    current: 'Current choice',
    essential: { title: 'Only essential account emails', text: 'No more non-essential emails: no news, tips or offers.' },
    all: { title: 'All emails', text: 'Essential emails, plus our news, tips and offers.' },
    save: 'Save my choice',
    saving: 'Saving…',
    unsubscribeTitle: 'Confirm unsubscribe',
    unsubscribeText: 'One click and you will only receive essential account emails.',
    unsubscribeButton: 'Unsubscribe from non-essential emails',
    saved: {
      essential_only: 'Done: from now on you will only receive essential account emails.',
      all: 'Done: you will receive all our emails.',
    },
    always: 'Whatever you choose, we always send the emails you need: security codes, receipts and invoices, and replies to your own requests.',
    error: (email: string) => `Your choice could not be saved. Please try again in a few minutes or email us at ${email}.`,
    invalid: 'This link is not valid or was only partly copied. Ask for a new link below.',
    askTitle: 'Get a link to manage your preferences',
    askText: 'To protect your address, enter it below: we will email you a personal link to choose which emails you receive. Nobody else can change your preferences.',
    emailLabel: 'Your email address',
    send: 'Email me the link',
    sending: 'Sending…',
    sent: 'If this address is valid, an email with your personal link is on its way (check your spam folder too).',
    tooMany: 'Too many requests: please try again later.',
  },
  linkMail: {
    subject: (brand: string) => `Your ${brand} email preferences`,
    hello: 'Hello,',
    line: (brand: string) => `Here is your personal link to choose which emails you receive from ${brand}:`,
    button: 'Manage my preferences',
    ignore: 'If you didn’t ask for this, just ignore this email: nothing will change.',
  },
  copyMail: {
    subject: (agent, brand) => (agent ? `Copy of your conversation with ${agent} · ${brand}` : `Copy of your conversation with ${brand}`),
    intro: (agent, _gender, brand, day, time) =>
      `Here is a copy of your conversation with ${agent ? `${agent}, ${brand}’s AI assistant,` : `${brand}’s AI assistant`} on ${day} at ${time}. You can keep or copy it as you like.`,
    you: 'You',
    assistant: 'AI assistant',
    cut: '(message shortened)',
    truncated: (shown, total) => `Very long conversation: this copy only includes the first ${shown} messages (out of ${total}).`,
    linkRemoved: '[link removed]',
    notYou: 'You are receiving this email because this address was given during the conversation. If you did not ask for it, please ignore it.',
  },
  // Sign-in code for the My account page (src/lib/accountCode.ts), essential email.
  accountCode: {
    subject: (brand: string, code: string) => `Your ${brand} sign-in code: ${code}`,
    hello: 'Hello,',
    line: (brand: string) => `Here is your code to access your account on the ${brand} website:`,
    valid: 'It is valid for 10 minutes and can only be used once.',
    ignore: 'If you didn’t ask for it, just ignore this email: nobody can access your account without this code.',
  },
  // Confirmation of a support request (ticket T-XXXXXXXX), essential email to the person who made it
  // (src/lib/tickets.ts): information only, no prices or offers. when: callback date and time in words.
  ticketMail: {
    subject: (ticket: string, brand: string) => `Your support request ${ticket} has been received · ${brand}`,
    hello: (first: string | null) => (first ? `Hello ${first},` : 'Hello,'),
    recorded: (ticket: string) => `We have received your support request under reference ${ticket}. Please keep this number: it lets us find your request quickly if you get in touch again.`,
    callAt: (when: string) => `We will call you back on ${when}.`,
    asap: 'We will call you back as soon as possible, during our calling hours.',
    team: 'A member of our team will get back to you as soon as possible.',
    reply: 'To add any details, simply reply to this email and quote your ticket number.',
    notYou: 'If you did not make this request, please ignore this message.',
    sign: (brand: string) => `The ${brand} team`,
  },
};
