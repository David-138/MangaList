import React, { useState } from "react";
import "./../css/achievements.css";
import Header from "../../Components/Header/header";
import AchievementDetail from "../../Components/AchievementDetail/achievementdetail";
import achievementsData from "../AyudaParaInserts/text";

function Achievements() {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "es" : "en"));
  };
  const [showAchievement, setShowAchievement] = useState(false);
  const toggleAchievement = () => {
    setShowAchievement(!showAchievement);
  };
  return (
    <>
      <Header />
      <button onClick={toggleLanguage}>
        {language === "en" ? "English" : "Español"}
      </button>
      <div className={showAchievement ? "" : "hidden"}>
        <div className="details">
          <AchievementDetail />
        </div>
        <div className="detailsBackground" onClick={toggleAchievement} />
      </div>
      <div className="achievements">
        <h3>Demography</h3>
        {achievementsData.achievementsDemographic.map((achievement) => (
          <div className="achievement" key={achievement.id}>
            <img src={achievement.noConsg} alt={achievement.title} />
            <p>
              {language === "en" ? achievement.title : achievement.titleEsp}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Achievements;
