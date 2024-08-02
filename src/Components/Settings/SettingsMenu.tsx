import { useEffect, useRef } from "react";
import "./SettingsMenu.scss";

export default function SettingsMenu() {
    const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const { left, top, width, height } = target.getBoundingClientRect();
            const xPos = ((event.clientX - left) / width) * 100;
            const yPos = ((event.clientY - top) / height) * 100;
            target.style.background = `radial-gradient(circle at ${xPos}% ${yPos}%, #444444, #2e2e2e 125%)`;
        };

        const handleMouseLeave = (event: MouseEvent) => {
            (event.target as HTMLElement).style.background = "";
        };

        menuItemsRef.current.forEach(item => {
            if (item) {
                item.addEventListener("mousemove", handleMouseMove);
                item.addEventListener("mouseleave", handleMouseLeave);
            }
        });

        return () => {
            menuItemsRef.current.forEach(item => {
                if (item) {
                    item.removeEventListener("mousemove", handleMouseMove);
                    item.removeEventListener("mouseleave", handleMouseLeave);
                }
            });
        };
    }, []);

    return (
        <div className="settings-menu">
            {["Edit profile", "Authentication", "Privacy", "Log out"].map((text, index) => (
                <div
                    key={index}
                    className="settings-menu-item"
                    ref={el => menuItemsRef.current[index] = el}
                >
                    {text}
                </div>
            ))}
        </div>
    );
}
