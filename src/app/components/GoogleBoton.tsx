"use client";

type GoogleButtonProps = {
  onClick?: () => void;
  loading?: boolean;
};

export default function GoogleButton({
  onClick,
  loading = false,
}: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="
        w-full flex items-center justify-center gap-3
        rounded-lg border border-slate-300
        bg-white text-slate-700
        py-2 px-4 text-sm font-medium
        hover:bg-slate-50 transition
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {/* GOOGLE ICON */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C34.9 2.6 29.8 0 24 0 14.6 0 6.6 5.4 2.8 13.2l7.3 5.7C12 13 17.6 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.1 24.6c0-1.7-.2-3.4-.6-5H24v9.4h12.5c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4c4.1-3.8 6.5-9.4 6.5-16.6z"
        />
        <path
          fill="#FBBC05"
          d="M10.1 28.9c-.6-1.7-.9-3.5-.9-5.4s.3-3.7.9-5.4l-7.3-5.7C1 16.1 0 20 0 24s1 7.9 2.8 11.7l7.3-5.8z"
        />
        <path
          fill="#34A853"
          d="M24 48c5.8 0 10.9-1.9 14.5-5.1l-7-5.4c-1.9 1.3-4.3 2-7.5 2-6.4 0-12-3.5-14.8-8.6l-7.3 5.8C6.6 42.6 14.6 48 24 48z"
        />
      </svg>

      <span>
        {loading ? "Conectando..." : "Iniciar sesión con Google"}
      </span>
    </button>
  );
}
