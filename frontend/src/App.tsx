import { useCallback, useRef, useState } from "react";
import { BrowseScreen } from "./components/BrowseScreen";
import { CrewsScreen } from "./components/CrewsScreen";
import { MatchesScreen } from "./components/MatchesScreen";
import { MatchScreen } from "./components/MatchScreen";
import { MeScreen } from "./components/MeScreen";
import { NavBar } from "./components/NavBar";
import { ProfileScreen } from "./components/ProfileScreen";
import { SplashScreen } from "./components/SplashScreen";
import { getProfileId, getWriteToken } from "./lib/storage";
import type { Profile, ScreenId } from "./lib/types";

interface MatchState {
  buddy: Profile;
  myProfile: Profile;
  sharedFoods: string[];
}

export function App() {
  const [profileId, setProfileId] = useState<string | null>(getProfileId);
  const [writeToken, setWriteToken] = useState<string | null>(getWriteToken);
  const [screen, setScreen] = useState<ScreenId>("splash");
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const profilesRef = useRef<Profile[]>([]);

  const showNav = ["browse", "crews", "matches", "me"].includes(screen);

  const onStart = useCallback(() => {
    setScreen(profileId ? "browse" : "profile");
  }, [profileId]);

  const onMatch = useCallback((buddy: Profile, myProfile: Profile, sharedFoods: string[]) => {
    setMatchState({ buddy, myProfile, sharedFoods });
    setScreen("match");
  }, []);

  const onMatchContinue = useCallback(() => {
    setMatchState(null);
    setScreen("browse");
  }, []);

  return (
    <>
      {screen === "splash" && <SplashScreen onStart={onStart} />}
      {screen === "profile" && (
        <ProfileScreen
          onCreated={(id, token) => {
            setProfileId(id);
            setWriteToken(token);
          }}
          onNavigate={setScreen}
        />
      )}
      {screen === "browse" && profileId && (
        <BrowseScreen
          profileId={profileId}
          writeToken={writeToken ?? ""}
          onMatch={onMatch}
          onNavigate={setScreen}
          profilesRef={profilesRef}
        />
      )}
      {screen === "match" && matchState && (
        <MatchScreen
          buddy={matchState.buddy}
          myProfile={matchState.myProfile}
          sharedFoods={matchState.sharedFoods}
          onContinue={onMatchContinue}
          onNavigate={setScreen}
        />
      )}
      {screen === "matches" && profileId && (
        <MatchesScreen profileId={profileId} writeToken={writeToken ?? ""} onNavigate={setScreen} />
      )}
      {screen === "crews" && profileId && <CrewsScreen profileId={profileId} profilesRef={profilesRef} />}
      {screen === "me" && profileId && (
        <MeScreen profileId={profileId} writeToken={writeToken ?? ""} profilesRef={profilesRef} />
      )}
      {showNav && <NavBar active={screen} onNavigate={setScreen} />}
    </>
  );
}
