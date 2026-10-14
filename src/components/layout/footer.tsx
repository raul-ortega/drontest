"use client";

import { useState } from "react";
import { DroneIcon } from "@/components/icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DroneIcon className="h-4 w-4" />
            <span>
              © {currentYear} DronTest. No es una aplicación oficial de AESA.
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="/privacidad" className="hover:text-foreground transition-colors">
              Privacidad
            </a>
            <a href="/terminos" className="hover:text-foreground transition-colors">
              Términos
            </a>
            <a href="/contacto" className="hover:text-foreground transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
