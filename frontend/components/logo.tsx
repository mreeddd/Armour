import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  textColor?: string
  size?: "sm" | "md" | "lg"
  linkWrapper?: boolean
  showText?: boolean
}

export function Logo({
  className = "",
  textColor = "text-gray-900",
  size = "md",
  linkWrapper = false,
  showText = true,
}: LogoProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-9 w-9",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  }

  const content = (
    <>
      <div className="relative">
        <Image
          src="/love_logo_new.png"
          alt="Almour Logo"
          width={36}
          height={36}
          className={sizeClasses[size]}
          style={{ filter: "brightness(0) invert(1)" }} // This makes the logo white/transparent
        />
      </div>
      {showText && <span className={`font-bold ${textColor} ${textSizeClasses[size]}`}>Almour</span>}
    </>
  )

  if (linkWrapper) {
    return (
      <Link href="/" className={`flex items-center gap-2 ${className}`}>
        {content}
      </Link>
    )
  }

  return <div className={`flex items-center gap-2 ${className}`}>{content}</div>
}
