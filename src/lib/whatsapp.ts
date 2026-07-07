export const WHATSAPP_NUMBER = "21695776339"; // Djerba Fun booking line

export interface BookingParams {
  activity: string;
  date?: string;
  adults?: number;
  children?: number;
  hotel?: string;
}

export function buildWhatsAppUrl({
  activity,
  date = "",
  adults = 1,
  children = 0,
  hotel = "",
}: BookingParams): string {
  const lines = [
    "Hello, I would like to book:",
    `Activity: ${activity}`,
    `Date: ${date || "(to be confirmed)"}`,
    `Number of Adults: ${adults}`,
    `Number of Children: ${children}`,
    `Hotel: ${hotel || "(to be confirmed)"}`,
    "Thank you.",
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
