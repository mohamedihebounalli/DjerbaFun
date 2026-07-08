export const WHATSAPP_NUMBER = "21695776339"; // Djerba Fun booking line

export interface BookingParams {
  activity: string;
  option?: string;
  date?: string;
  adults?: number;
  children?: number;
  hotel?: string;
  pickupLocation?: string;
  customerName?: string;
}

export function buildWhatsAppUrl({
  activity,
  option,
  date = "",
  adults = 1,
  children = 0,
  hotel = "",
  pickupLocation = "",
  customerName = "",
}: BookingParams): string {
  const lines = [
    "Hello, I would like to book:",
    `Activity: ${activity}`,
  ];
  
  if (customerName) {
    lines.push(`Name: ${customerName}`);
  }

  if (option) {
    lines.push(`Option: ${option}`);
  }

  lines.push(
    `Date: ${date || "(to be confirmed)"}`,
    `Number of Adults: ${adults}`,
    `Number of Children: ${children}`
  );

  if (hotel) {
    lines.push(`Hotel/Location: ${hotel}`);
  }

  if (pickupLocation) {
    lines.push(`Pickup Checkpoint: ${pickupLocation}`);
  }

  lines.push(
    "Thank you."
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}


