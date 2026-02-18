const Footer = () => {
  return (
    <footer className="bg-foreground text-background/50 border-t border-background/10 py-8 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-serif text-lg text-background">
          DBW <span className="text-primary">Saúde</span>
        </p>
        <p className="text-sm">
          © {new Date().getFullYear()} DBW – Saúde Services. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
