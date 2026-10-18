export function speak(text: string, rate = 0.9): boolean {
  if (!("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "it-IT";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
  return true;
}
