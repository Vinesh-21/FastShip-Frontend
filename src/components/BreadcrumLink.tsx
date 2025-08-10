import React from "react";
import { Link } from "react-router";

interface BreadcrumLinkProp {
  to: string;
  children: React.ReactNode;
}

function BreadcrumLink({ to, children }: BreadcrumLinkProp) {
  return <Link to={to}>{children}</Link>;
}

export default BreadcrumLink;
