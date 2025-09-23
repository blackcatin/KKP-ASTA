import IllustrationImage from "../../assets/Image/illustrations.png";

export default function Illustration() {
    return (
        <div className="relative z-10 w-full max-w-xl">
            <img
                src={IllustrationImage}
                alt="Illustration"
                className="object-contain w-full h-full"
            />
        </div>
    )
}