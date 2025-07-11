// app/components/ui/card.js
import * as React from "react";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
