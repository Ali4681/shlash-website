"use client";

import type { ContactChannel } from "@/data/contact";
import { usePrefs } from "@/components/providers/PrefsProvider";
import "./contact-cards.css";

function Icon({ type }: { type: ContactChannel["type"] }) {
  if (type === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
        <path
          fill="currentColor"
          d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.39 1.01 2.56.12.17 1.75 2.67 4.23 3.74 1.48.64 2.06.69 2.8.58.45-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.11-.25-.17-.5-.29z"
        />
      </svg>
    );
  }
  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden>
        <path
          d="M6.6 3.8c.4-1 1.5-1.4 2.4-1l2 1c.8.3 1.2 1.2.9 2l-.7 1.8c-.2.4 0 .9.3 1.2l2.6 2.6c.3.3.8.5 1.2.3l1.8-.7c.8-.3 1.7.1 2 .9l1 2c.4.9 0 2-1 2.4-2.2.9-5.9.3-9.5-3.3S4.9 6 5.8 3.8z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactCards({ channels: allChannels }: { channels: ContactChannel[] }) {
  const { dict } = usePrefs();
  const channels = allChannels.filter((c) => c.enabled);

  const copy = {
    whatsapp: {
      title: dict.contactCards.whatsappTitle,
      action: dict.contactCards.whatsappAction,
    },
    phone: {
      title: dict.contactCards.phoneTitle,
      action: dict.contactCards.phoneAction,
    },
    email: {
      title: dict.contactCards.emailTitle,
      action: dict.contactCards.emailAction,
    },
  } as const;

  return (
    <div className="contact-cards">
      {channels.map((ch) => {
        const meta = copy[ch.type];
        return (
          <a
            key={ch.id}
            href={ch.href}
            className={`contact-card contact-card--${ch.type}`}
            target={ch.type === "whatsapp" || ch.type === "email" ? "_blank" : undefined}
            rel={ch.type === "whatsapp" || ch.type === "email" ? "noreferrer" : undefined}
          >
            <span className="contact-card__icon">
              <Icon type={ch.type} />
            </span>
            <span className="contact-card__title">{meta.title}</span>
            <strong className="contact-card__value" dir="ltr" lang="en">
              {ch.value}
            </strong>
            <span className="contact-card__action">{meta.action}</span>
          </a>
        );
      })}
    </div>
  );
}
