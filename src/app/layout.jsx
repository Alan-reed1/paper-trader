import './globals.css';

export const metadata = {
  title: "VaultQuest",
  description: "Gamified finance education",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[--color-vault-dark] text-[--color-light-text]">
        {children}
      </body>
    </html>
  );
}
