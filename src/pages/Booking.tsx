import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Shield, Clock } from "lucide-react";

const bookingSchema = z.object({
  servico: z.enum(["aquaticas", "personalizado", "laboral", "grupo"], { required_error: "Seleccione um serviço" }),
  nome: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  telefone: z.string().trim().min(9, "Número de telefone inválido").max(20),
  empresa: z.string().trim().max(100).optional(),
  tipoCliente: z.enum(["adulto", "crianca"]).optional(),
  experienciaNatacao: z.enum(["sim", "nao"]).optional(),
  numColaboradores: z.string().trim().max(10).optional(),
  mensagem: z.string().trim().max(500).optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

const serviceOptions = [
  { value: "aquaticas" as const, icon: "🏊", label: "Actividades Aquáticas" },
  { value: "personalizado" as const, icon: "🎯", label: "Treino Personalizado" },
  { value: "laboral" as const, icon: "💼", label: "Ginástica Laboral" },
  { value: "grupo" as const, icon: "⚡", label: "Aulas em Grupo" },
];

const serviceLabels: Record<string, string> = {
  aquaticas: "Actividades Aquáticas",
  personalizado: "Treino Personalizado",
  laboral: "Ginástica Laboral",
  grupo: "Aulas em Grupo",
};

const Booking = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { servico: undefined, nome: "", email: "", telefone: "", empresa: "", mensagem: "" },
  });

  const servico = form.watch("servico");

  const goNext = async () => {
    if (step === 1) {
      const valid = await form.trigger("servico");
      if (valid) setStep(2);
    } else if (step === 2) {
      const fields: (keyof BookingForm)[] = ["nome", "email", "telefone"];
      if (servico === "laboral") fields.push("empresa");
      const valid = await form.trigger(fields);
      if (valid) setStep(3);
    }
  };

  const onSubmit = (data: BookingForm) => {
    // Build WhatsApp message with all captured form data
    const lines = [
      `Olá! Gostaria de me inscrever:`,
      ``,
      `*Serviço:* ${serviceLabels[data.servico]}`,
      `*Nome:* ${data.nome}`,
      `*Email:* ${data.email}`,
      `*Telefone:* ${data.telefone}`,
    ];
    if (data.empresa) lines.push(`*Empresa:* ${data.empresa}`);
    if (data.numColaboradores) lines.push(`*Nº Colaboradores:* ${data.numColaboradores}`);
    if (data.tipoCliente) lines.push(`*Tipo:* ${data.tipoCliente === "adulto" ? "Adulto" : "Criança"}`);
    if (data.experienciaNatacao) lines.push(`*Experiência natação:* ${data.experienciaNatacao === "sim" ? "Sim" : "Não"}`);
    if (data.mensagem) lines.push(`*Mensagem:* ${data.mensagem}`);
    const msg = lines.join("\n");

    const whatsappUrl = `https://wa.me/244922569283?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank");
    navigate(`/obrigado?nome=${encodeURIComponent(data.nome)}`);
  };

  return (
    <>
      <Helmet>
        <title>Reservar Vaga — DBW Fitness Luanda</title>
        <meta name="description" content="Reserve a sua vaga nos programas de fitness da DBW em Luanda. Resposta garantida em 24 horas." />
      </Helmet>
      <main>
        <Navbar />

        <section className="bg-foreground text-primary-foreground pt-28 pb-16 px-6">
          <div className="container mx-auto text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold">
              Reserve a Sua <span className="text-primary">Vaga</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-primary-foreground/60 font-sans mt-4">
              Escolha o seu serviço e garantimos resposta em menos de 24 horas.
            </motion.p>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container mx-auto max-w-2xl">
            {/* Progress */}
            <div className="flex items-center justify-center gap-3 mb-12">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-bold ${
                    step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-border"}`} />}
                </div>
              ))}
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1 */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Qual serviço lhe interessa?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {serviceOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => form.setValue("servico", opt.value, { shouldValidate: true })}
                          className={`p-6 rounded-lg border-2 text-left transition-colors ${
                            servico === opt.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <span className="text-3xl block mb-2">{opt.icon}</span>
                          <span className="font-display font-bold text-foreground uppercase text-lg">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                    {form.formState.errors.servico && (
                      <p className="text-destructive text-sm font-sans mt-3">{form.formState.errors.servico.message}</p>
                    )}
                    <div className="mt-8 flex justify-end">
                      <Button type="button" onClick={goNext} size="lg" className="uppercase font-display font-bold tracking-wider">
                        Continuar →
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Sobre si</h2>
                    <div className="space-y-5">
                      <div>
                        <Label htmlFor="nome" className="font-sans">Nome completo *</Label>
                        <Input id="nome" {...form.register("nome")} className="mt-1" />
                        {form.formState.errors.nome && <p className="text-destructive text-sm font-sans mt-1">{form.formState.errors.nome.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="email" className="font-sans">Email *</Label>
                        <Input id="email" type="email" {...form.register("email")} className="mt-1" />
                        {form.formState.errors.email && <p className="text-destructive text-sm font-sans mt-1">{form.formState.errors.email.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="telefone" className="font-sans">Telefone / WhatsApp *</Label>
                        <Input id="telefone" {...form.register("telefone")} className="mt-1" />
                        {form.formState.errors.telefone && <p className="text-destructive text-sm font-sans mt-1">{form.formState.errors.telefone.message}</p>}
                      </div>

                      {servico === "aquaticas" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="font-sans">Para quem é?</Label>
                            <div className="flex gap-3 mt-2">
                              {["adulto", "crianca"].map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => form.setValue("tipoCliente", v as "adulto" | "crianca")}
                                  className={`px-4 py-2 rounded-lg border text-sm font-sans ${
                                    form.watch("tipoCliente") === v ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground"
                                  }`}
                                >
                                  {v === "adulto" ? "Adulto" : "Criança"}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label className="font-sans">Experiência em natação?</Label>
                            <div className="flex gap-3 mt-2">
                              {["sim", "nao"].map((v) => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => form.setValue("experienciaNatacao", v as "sim" | "nao")}
                                  className={`px-4 py-2 rounded-lg border text-sm font-sans ${
                                    form.watch("experienciaNatacao") === v ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground"
                                  }`}
                                >
                                  {v === "sim" ? "Sim" : "Não"}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {servico === "laboral" && (
                        <>
                          <div>
                            <Label htmlFor="empresa" className="font-sans">Nome da empresa *</Label>
                            <Input id="empresa" {...form.register("empresa")} className="mt-1" />
                            {form.formState.errors.empresa && <p className="text-destructive text-sm font-sans mt-1">{form.formState.errors.empresa.message}</p>}
                          </div>
                          <div>
                            <Label htmlFor="numColaboradores" className="font-sans">Número estimado de colaboradores</Label>
                            <Input id="numColaboradores" {...form.register("numColaboradores")} className="mt-1" />
                          </div>
                        </>
                      )}

                      <div>
                        <Label htmlFor="mensagem" className="font-sans">Mensagem / observações</Label>
                        <Textarea id="mensagem" {...form.register("mensagem")} className="mt-1" rows={3} />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="uppercase font-display font-bold tracking-wider">
                        ← Voltar
                      </Button>
                      <Button type="button" onClick={goNext} size="lg" className="uppercase font-display font-bold tracking-wider">
                        Continuar →
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Reveja os seus dados</h2>
                    <div className="bg-secondary rounded-lg p-6 space-y-3 font-sans mb-8">
                      <div className="flex justify-between"><span className="text-muted-foreground">Serviço</span><span className="font-medium text-foreground">{serviceLabels[servico]}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Nome</span><span className="font-medium text-foreground">{form.getValues("nome")}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium text-foreground">{form.getValues("email")}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Telefone</span><span className="font-medium text-foreground">{form.getValues("telefone")}</span></div>
                      {form.getValues("empresa") && (
                        <div className="flex justify-between"><span className="text-muted-foreground">Empresa</span><span className="font-medium text-foreground">{form.getValues("empresa")}</span></div>
                      )}
                      {form.getValues("mensagem") && (
                        <div className="flex justify-between"><span className="text-muted-foreground">Mensagem</span><span className="font-medium text-foreground text-right max-w-[60%]">{form.getValues("mensagem")}</span></div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground font-sans mb-3">
                      <Shield className="w-4 h-4 text-primary" /> A sua informação é segura
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground font-sans mb-8">
                      <Clock className="w-4 h-4 text-primary" /> Resposta em até 24h úteis
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="uppercase font-display font-bold tracking-wider">
                        ← Voltar
                      </Button>
                      <Button type="submit" size="lg" className="uppercase font-display font-bold tracking-wider">
                        Confirmar Inscrição →
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default Booking;
