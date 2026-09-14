"use client";

import { useEffect, useState } from "react";

/**
 * Botão que lê a pergunta em voz alta.
 *
 * Usa a voz do próprio navegador (`speechSynthesis`): não custa nada, não
 * precisa de arquivo de áudio e passa a valer automaticamente para toda
 * pergunta nova que for escrita. Gravar 102 arquivos — e mais um a cada
 * pergunta — sairia caro e desatualizaria sozinho.
 *
 * Nunca toca sozinho. Áudio que começa sem ninguém pedir é intrusivo: a
 * pessoa pode estar num culto, no ônibus, ao lado de alguém dormindo.
 */
export default function Ouvir({
  texto,
  aoMudar,
}: {
  texto: string;
  /** Avisa o quiz para pausar o cronômetro enquanto a voz fala. */
  aoMudar?: (falando: boolean) => void;
}) {
  const [falando, setFalando] = useState(false);
  const [temVoz, setTemVoz] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    // getVoices() volta vazio no primeiro acesso em alguns navegadores: a
    // lista chega depois, pelo evento. Sem esperar, o botão sumiria à toa.
    const conferir = () => {
      const vozes = window.speechSynthesis.getVoices();
      setTemVoz(vozes.some((v) => v.lang.toLowerCase().startsWith("pt")));
    };
    conferir();
    window.speechSynthesis.addEventListener("voiceschanged", conferir);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", conferir);
    };
  }, []);

  // Trocou de pergunta ou saiu da tela: cala a boca na hora.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [texto]);

  function alternar() {
    if (!("speechSynthesis" in window)) return;

    if (falando) {
      window.speechSynthesis.cancel();
      setFalando(false);
      aoMudar?.(false);
      return;
    }

    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    // Um pouco mais devagar que o padrão: é leitura para entender, não
    // para correr. Quem tem dificuldade de ler costuma precisar disso.
    fala.rate = 0.95;

    const voz = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith("pt"));
    if (voz) fala.voice = voz;

    fala.onend = () => {
      setFalando(false);
      aoMudar?.(false);
    };
    fala.onerror = () => {
      setFalando(false);
      aoMudar?.(false);
    };

    setFalando(true);
    aoMudar?.(true);
    window.speechSynthesis.speak(fala);
  }

  // Sem voz em português, o botão não aparece: ler a pergunta com sotaque
  // inglês seria pior do que não ler.
  if (!temVoz) return null;

  return (
    <button
      type="button"
      className={`ouvir${falando ? " ouvir-falando" : ""}`}
      onClick={alternar}
      aria-label={falando ? "Parar a leitura" : "Ouvir a pergunta"}
    >
      <span aria-hidden="true">{falando ? "◼" : "▶"}</span>
      {falando ? "Parar" : "Ouvir"}
    </button>
  );
}
