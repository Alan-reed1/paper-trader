import "./globals.css";

export const metadata = {
  title: "my app",
  description: "par moi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
