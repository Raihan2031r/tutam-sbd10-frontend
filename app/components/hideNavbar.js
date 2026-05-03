import { useState, useEffect } from "react";

export default function useHideNavbar() {
    const [hideNavbar, setHideNavbar] = useState(false);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setHideNavbar(currentScrollY > lastScrollY && currentScrollY > 50);
            lastScrollY = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return hideNavbar;
}