export default function Footer() {
  return (
    <footer className="footer items-center p-4 bg-base-200 text-base-content">
      <div className="items-center grid-flow-col">
        <span>© {new Date().getFullYear()} Yunia AI. All Rights Reserved.</span>
      </div>
      <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a className="link link-hover" href="#">Privacy</a>
        <a className="link link-hover" href="#">Terms</a>
      </div>
    </footer>
  );
}