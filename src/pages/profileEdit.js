import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Pressable, Text, TextInput, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Defs, ClipPath, Path, Image as SvgImage } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import Header3 from "../components/header3";
import MyProfile from "./myProfile";

export default function ProfileEdit() {
    const navigation = useNavigation();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(true); // 프로필 편집 여부 상태

    const handleProfileEdit = () => {
        setIsEditing(false); // 다시 마이프로필로 돌아가기
      };

    // 입력 필드별 상태
    const [nickname, setNickname] = useState("");
    const [university, setUniversity] = useState("");
    const [introduction, setIntroduction] = useState("");
  
    // 사용자 정보 불러오기
    const loadUserInfo = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem("userInfo");
        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);
  
          // 초기값 설정
          setNickname(parsedUserInfo.nickname || "");
          setUniversity(parsedUserInfo.university || "");
          setIntroduction(parsedUserInfo.introduction || "");
        }
      } catch (error) {
        console.error("사용자 정보 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // 수정 완료 핸들러
    const handleSaveChanges = async () => {
      try {
        // 기존 userInfo와 병합하여 업데이트
        const updatedUserInfo = {
          ...userInfo,
          nickname: nickname || userInfo?.nickname || "",
          university: university || userInfo?.university || "",
          introduction: introduction || userInfo?.introduction || "",
        };
  
        // AsyncStorage에 저장
        await AsyncStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        setUserInfo(updatedUserInfo);
  
        alert("수정이 완료되었습니다!");
        navigation.navigate("MyProfile");
        handleProfileEdit();

      } catch (error) {
        console.error("정보 저장 오류:", error);
        alert("정보 저장 중 문제가 발생했습니다.");
      }
    };
  
    useEffect(() => {
      loadUserInfo();
    }, []);
  
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff6152" />
        </View>
      );
    }
    if (!isEditing) {
        return <MyProfile />;
      }
  
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Header3 />
          {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          {/* 프로필 이미지 */}
          <View style={styles.profileImageContainer}>
            <Svg width={155} height={150}>
              <Defs>
                <ClipPath id="mixmix">
                  <Path d="M77.5 23.3165C17.5702 -29.9316 -30.9666 17.0581 24.073 75C-30.9666 132.994 17.5702 179.984 77.5 126.684C137.43 179.932 185.967 132.942 130.927 75C185.967 17.006 137.43 -29.9838 77.5 23.3165Z" />
                </ClipPath>
              </Defs>
              <SvgImage
                href={userInfo?.profileImageUrl || "https://via.placeholder.com/120"}
                width="100%"
                height="100%"
                clipPath="url(#mixmix)"
                preserveAspectRatio="xMidYMid slice"
              />
            </Svg>
          </View>
          </View>
          {/* 닉네임 */}
          <View style={styles.editContainer}>
            <Text style={styles.editField}>닉네임</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력하세요"
              placeholderTextColor="#d9d9d9"
            />
          </View>
  
          {/* 학교명 */}
          <View style={styles.editContainer}>
            <Text style={styles.editField}>학교명</Text>
            <TextInput
              style={styles.input}
              value={university}
              onChangeText={setUniversity}
              placeholder="학교명을 입력하세요"
              placeholderTextColor="#d9d9d9"
            />
          </View>
  
          {/* 한줄 소개 */}
          <View style={styles.editContainer}>
            <Text style={styles.editField}>한줄소개</Text>
            <TextInput
              style={styles.input}
              value={introduction}
              onChangeText={setIntroduction}
              placeholder="자기소개를 입력하세요"
              placeholderTextColor="#d9d9d9"
            />
          </View>
  
          {/* 수정 완료 버튼 */}
          <Pressable style={styles.editFin} onPress={handleSaveChanges}>
            <View style={styles.editFin2}>
            <Text style={styles.editFinText}>수정완료</Text>
            </View>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

const styles = StyleSheet.create({
editFin: {
    width: 361,
    height: 51,
    backgroundColor: "#ff6152",
    borderRadius: 12,
    paddingHorizontal: 70,
    paddingVertical: 16,
    marginTop: "20%",
    marginHorizontal: 8,
},
editFin2: {
    position: "absolute",
    left: 155,
    top: 15,
},
editFinText: {
    fontFamily: "Pretendard-SemiBold",
    color: "#ffffff",
    fontSize: 16,
},
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  editContainer: {
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 32,
    // justifyContent: "",
  },
  input: {
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    borderColor: "#d9d9d9",
    borderWidth: 1,
    borderRadius: 10,
    position: "absolute",
    width: 283,
    height: 40,
    right: 0,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  editField: {
    fontFamily: "Pretendard-Medium",
    left: 16,
    textAlign: "left",
    color: "#000",
    // backgroundColor: "red",
  },
  header: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  headerText: {
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: "Pretendard-SemiBold",
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#fff",
  },
  universityName: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: "#000",
  },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    marginRight: 16,
    right: 0,
    borderRadius: 25,
    borderColor: "#d9d9d9",
    borderWidth: 1,
    marginVertical: 8,
  },
  streakNumber: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: "#000",
    marginRight: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  streakIcon: {
    width: 20,
    height: 20,
    marginLeft: 4,
  },
  profileImageContainer: {
    position: "relative",
    width: 155,
    height: 150,
    marginTop: 16,
  },
  badge: {
    position: "absolute",
    marginTop: -11,
    left: 9,
  },
  editIcon: {
    position: "absolute",
    right: 0,
    bottom: 9,
    marginRight: -16,
    
  },
profileNameContainer: {
  flexDirection: "row",
  alignItems: "center", 
  marginTop: 8,
  color: "#000",
},
profileName: {
  fontSize: 16,
  fontFamily: "Pretendard-SemiBold",
  color: "#000",
},
profileNation: {
  fontSize: 12,
  fontFamily: "Pretendard-SemiBold",
  marginLeft: 4,
  color: "#000",
},

 message: {
  fontSize: 14,
  fontFamily: "Pretendard-Regular",  
  marginTop: 4,
  color: "#333",
},
  postsSection: {
    flexDirection: "row",
    justifyContent: "space-evenly", 
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#ffffff", 
  },
  postCategory: {
    alignItems: "center", 
  },
  line: {
    width: "20%",
    height: 2,
  },
  postLabel: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    marginBottom: 8,
  },
  postCount: {
    fontSize: 20,
    fontFamily: "Pretendard-SemiBold",
    color: "#000",
  },
  quizSection: {
    flexDirection: "row", // 가로 정렬
    alignItems: "center", // 세로축 가운데 정렬
    padding: 16,
    borderColor: "#d9d9d9",
    borderRadius: 8,
    borderWidth: 0.5,
    margin: 16,
  },
  quizIcon: {
    width: 24,
    height: 24, 
    marginRight: 12,
  },
  textGroup: {
    flexDirection: "column", 
  },
  quizTitle: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    marginBottom: 4, 
    textAlign: "left",
    color: "#000",
  },
  quizSubtitle: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: "#666", 
    textAlign: "left",
  },
  
  calendarSection: {
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 10,
    padding: 16,
    backgroundColor: "#222222",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 8,
  },
  weekDay: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 12,
    marginRight: 12,
  },
  calendarDates: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    // color: "#999999",
  },
  date: {
    flex: 1,
    alignItems: "center",
    marginVertical: 8,
    flexBasis: '14.28%',
    maxWidth: "14.28%",
  },
  dateText: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: "#999999",
  },
  dateSubtext: {
    fontSize: 12,
    textAlign: "center",
    color: "#777",
  }, 
  accountContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    // flexDirection: "column",
  },
  accountTitle: {
    fontSize: 12,
    marginBottom: 5,
    color: "#000",
  },
  accountEmail: {
    fontSize: 12,
    marginBottom: 10,
    color: "#000",
  },
  logoutText: {
    // textAlign: "right",
    // marginTop: -20,
    fontSize: 12,
    fontFamily: "Pretendard-Medium",
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderColor: "#767676",
  },
  logoutContainer: {
    position: "absolute",
    right: 0,
    marginTop: 20,
  },
  lineCalendarLine: {
    alignItems:"center", 
    marginTop: 40, 
    marginLeft: 4, 
    justifyContent: "center", 
    position: "absolute",
  },
  lineCalendarLine1: {
    marginTop: 110,
    position: "absolute",
    alignItems: "center",
    marginLeft: 4,
  },
  lineCalendarLine2: {
    marginTop: 180,
    position: "absolute",
    alignItems: "center",
    marginLeft: 4,
  },
  lineCalendarLine3: {
    marginTop: 250,
    position: "absolute",
    alignItems: "center",
    marginLeft: 4,
  },
  lineCalendarLine4: {
    marginTop: 320,
    position: "absolute",
    alignItems: "center",
    marginLeft: 4,
  },
  lineUnderCal: {
    marginVertical: 26,
  }
});
