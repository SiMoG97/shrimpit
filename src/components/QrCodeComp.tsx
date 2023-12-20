import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";

type QrCodeT = {
  shortUrl: string;
};
export default async function QrCodeComp({ shortUrl }: QrCodeT) {
  async function generateQR(text: string) {
    try {
      return await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        // color: {
        //   dark: "#ff0000",
        //   light: "#0000ff",
        // },
      });
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  const imageUrl = await generateQR(shortUrl);
  return (
    <>
      <Link target="_blank" href={imageUrl} download={"QRCodeImage"}>
        <Image src={imageUrl} width={100} height={100} alt="Qr code image" />
      </Link>
    </>
  );
}
