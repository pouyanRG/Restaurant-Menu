"use client";
import { useState } from "react";
import { HeartIcon } from "./Icons";

export default function WishlistToggle({ label }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className={`wish${on ? " is-on" : ""}`}
      aria-label={`${on ? "Remove" : "Add"} ${label} ${on ? "from" : "to"} favorites`}
      aria-pressed={on}
      onClick={() => setOn(!on)}
    >
      <HeartIcon filled={on} />
    </button>
  );
}
