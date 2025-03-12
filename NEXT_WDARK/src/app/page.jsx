
import styles from "./page.module.css";
import Header from "./layout/header";
import Footer from "./layout/footer";
import AboutUs from "./components/aboutUs";
import MainBanner from "./components/mainBanner";
import FindUs from "./components/findUs";
import Services from "./components/services";
import Allies from "./components/allies";
import Link from "next/link";


export default function Home() {
  return (
    <div className={styles.page}>
      <MainBanner/>
      <AboutUs/>
      <Services/>
      <Allies/>
      <FindUs/>
    </div>
  );
}

