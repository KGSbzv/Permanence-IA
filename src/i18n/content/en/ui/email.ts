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
};
