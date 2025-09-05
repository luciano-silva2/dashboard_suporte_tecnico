import { useTheme } from "../Context/ContextoTema";
export default function Footer() {
    const { theme } = useTheme();

    const bgClass = theme === "light" ? "bg-light" : "bg-dark";
    const textClass = theme === "light" ? "text-dark" : "text-white";
    const borderClass = theme === "light" ? "border-dark" : "border-light";

    return (
<<<<<<< HEAD
        <div className={`text-center p-3 ${bgClass} ${textClass} ${borderClass} border`}>
=======
        <div className={`text-center p-3 fixed-bottom ${bgClass} ${textClass} ${borderClass} border`}>
>>>>>>> 6df865f689c64060e6f3dc33df31493d295c8386
            Footer
        </div>
    );
}
