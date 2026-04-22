interface Props {
  onStart: () => void;
}

export function SplashScreen({ onStart }: Props) {
  return (
    <div className="screen active">
      <div className="fish-icon">🐟</div>
      <h1>
        find your
        <br />
        fish market
        <br />
        buddy
      </h1>
      <p style={{ fontSize: 8, color: "var(--muted)", lineHeight: 1.6 }}>
        make a profile.
        <br />
        swipe for your crew.
      </p>
      <button type="button" className="btn" onClick={onStart}>
        let's go
      </button>
    </div>
  );
}
