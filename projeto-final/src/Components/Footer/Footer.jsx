import { useTheme } from "../Context/ContextoTema";
export default function Footer() {
    const { theme } = useTheme();

    const bgClass = theme === "light" ? "bg-light" : "bg-dark";
    const textClass = theme === "light" ? "text-dark" : "text-white";
    const borderClass = theme === "light" ? "border-dark" : "border-light";

    return (
        <div className={`text-center p-3 fixed-bottom ${bgClass} ${textClass} ${borderClass} border`}>
            Footer
        </div>
    );
}
