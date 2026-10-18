import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "@mantine/core";
import styles from "../../styles/App.module.scss";

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function AppButton({
  children,
  variant = "primary",
  icon,
  fullWidth,
  className,
  ...props
}: AppButtonProps) {
  return (
    <Button
      unstyled
      className={`${styles.appButton} ${styles[`button_${variant}`]} ${fullWidth ? styles.fullWidth : ""} ${className ?? ""}`}
      {...props}
    >
      <span>{children}</span>
      {icon ? <span className={styles.buttonIcon} aria-hidden="true">{icon}</span> : null}
    </Button>
  );
}
