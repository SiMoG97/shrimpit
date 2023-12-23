import Link from "next/link";
import QRCode from "qrcode";
import { type ComponentProps } from "react";

type QrCodeT = {
  shortUrl: string;
} & ComponentProps<"button">;

export default async function DownloadQR({
  shortUrl,
  children,
  ...props
}: QrCodeT) {
  async function generateQR(text: string) {
    try {
      return await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
      });
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  const imageUrl = await generateQR(shortUrl);
  return (
    <button {...props} title="Download QR code image">
      <Link target="_blank" href={imageUrl} download={shortUrl}>
        {children}
      </Link>
    </button>
  );
}
