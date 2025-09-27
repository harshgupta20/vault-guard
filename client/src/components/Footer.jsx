import React from "react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="flex justify-center items-center mb-5">
        <span className="p-5">{"<<"}</span>
        <p className="text-muted-foreground text-lg">Made by EthDMS</p>
        <span className="p-5">{">>"}</span>
      </div>
    </footer>
  );
};

export default Footer;
