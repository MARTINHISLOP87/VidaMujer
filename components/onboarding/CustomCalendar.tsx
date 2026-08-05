import { Colors } from "@/theme";
import { StyleSheet } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";

//configuración de idioma para el calendario en español
LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy",
};

LocaleConfig.defaultLocale = "es";

interface CustomCalendarProps {
  selectedDate: string;
  onDateChange: (datestring: string) => void;
}

export default function CustomCalendar({
  selectedDate,
  onDateChange,
}: CustomCalendarProps) {
  const handleDayPress = (day: DateData) => {
    onDateChange(day.dateString);
  };
  return (
    <Calendar
      onDayPress={handleDayPress}
      maxDate={new Date().toISOString().split("T")[0]} // bloquea las fecha futuras
      markedDates={{
        [selectedDate]: {
          selected: true,
          disableTouchEvent: true,
          selectedColor: Colors.fucsia, // color de fondo de la fecha seleccionada
          selectedTextColor: "#000000",
        },
      }} // resalta la fecha seleccionada
      theme={{
        backgroundColor: "#ffffff",
        calendarBackground: "#ffffff",
        textSectionTitleColor: "#b6c1cd",
        selectedDayBackgroundColor: "#E6F4FE",
        selectedDayTextColor: "#000000",
        todayTextColor: "#f97ee1",
        dayTextColor: "#2d4150",
        arrowColor: Colors.fucsia,
        monthTextColor: "#000000",
        textMonthFontWeight: "bold",
      }}
      style={styles.calendarComponent}
    />
  );
}
const styles = StyleSheet.create({
  calendarComponent: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 15,
    overflow: "hidden",
    elevation: 2, // sombra para Android
    shadowColor: "#000", // sombra para iOS
    shadowOffset: { width: 0, height: 2 }, // sombra para iOS
    shadowOpacity: 0.05, // sombra para iOS
    shadowRadius: 4, // sombra para iOS
  },
});
