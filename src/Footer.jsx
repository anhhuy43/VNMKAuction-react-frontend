import logo from "./assets/images/123.png";

export default function Footer() {
  return (
    <footer>
      <div className="footer">
        <div className="contact">
          <p>The entire responsibility and management belong to VNMK.</p>
          <b>
            <p style={{ marginBottom: 0 }}>Contact:</p>
          </b>
          <a href="https://www.facebook.com/groups/vnmkmarket">FANPAGE VNMK</a>
          <br />
          <a href="https://www.facebook.com/VNMKMarket/">
            The management team of Vietnam Mechanical Keyboard Market (VNMK).
          </a>
        </div>
        <div className="logo">
          <img src={logo} alt="VNMK Logo" />
        </div>
      </div>
    </footer>
  );
}
