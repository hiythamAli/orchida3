// ===========================
// ✅ courses.js
// ===========================

// إنشاء بيانات أولية تلقائيًا إذا لم تكن موجودة
function initCourses() {
  const storedCourses = localStorage.getItem("coursesData");
  if (!storedCourses || JSON.parse(storedCourses).length === 0) {
    const defaultCourses = [
      { title: "أساسيات البرمجة الحديثة", duration: "4 أسابيع", seats: 30, registrants: [] },
      { title: "تصميم واجهات المستخدم UI/UX", duration: "6 أسابيع", seats: 20, registrants: [] },
      { title: "التسويق الرقمي وإدارة المحتوى", duration: "5 أسابيع", seats: 25, registrants: [] },
      { title: "مهارات الكتابة الاحترافية", duration: "3 أسابيع", seats: 15, registrants: [] },
    ];
    localStorage.setItem("coursesData", JSON.stringify(defaultCourses));
  }
}
initCourses();

// تحميل البيانات من LocalStorage
let coursesData = JSON.parse(localStorage.getItem("coursesData"));
const coursesGrid = document.getElementById("coursesGrid");
const courseModal = document.getElementById("courseModal");
const modalClose = document.getElementById("modalClose");
const cancelCourse = document.getElementById("cancelCourse");
const confirmCourse = document.getElementById("confirmCourse");
const doneCourse = document.getElementById("doneCourse");
const successCourse = document.getElementById("successCourse");
const successTextCourse = document.getElementById("successTextCourse");
const formContainer = document.getElementById("formContainer");

let selectedCourseIndex = null;

// ===========================
// ✅ عرض الدورات
// ===========================
function renderCourses() {
  coursesGrid.innerHTML = "";
  coursesData = JSON.parse(localStorage.getItem("coursesData"));

  coursesData.forEach((course, index) => {
    const availableSeats = course.seats - course.registrants.length;

    const card = document.createElement("div");
    card.className = "course-card glass";
    card.innerHTML = `
      <img src="photos/download (15).jpeg" alt="${course.title}">
      <div class="course-content">
        <h3>${course.title}</h3>
        <p>المدة: ${course.duration}</p>
        <p>المقاعد المتاحة: ${availableSeats}</p>
        <button class="btn primary register-btn" data-index="${index}" ${availableSeats === 0 ? "disabled" : ""}>تسجيل</button>
      </div>
    `;
    coursesGrid.appendChild(card);
  });
}

// ===========================
// ✅ فتح المودال عند التسجيل
// ===========================
coursesGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".register-btn");
  if (!btn) return;
  selectedCourseIndex = parseInt(btn.dataset.index);
  formContainer.classList.remove("hidden");
  successCourse.classList.add("hidden");
  courseModal.classList.remove("hidden");
});

// ===========================
// ✅ إغلاق المودال
// ===========================
modalClose.addEventListener("click", () => courseModal.classList.add("hidden"));
cancelCourse.addEventListener("click", () => courseModal.classList.add("hidden"));

// ===========================
// ✅ تأكيد التسجيل
// ===========================
confirmCourse.addEventListener("click", () => {
  const name = document.getElementById("courseName").value.trim();
  const phone = document.getElementById("coursePhone").value.trim();
  const email = document.getElementById("courseEmail").value.trim();

  if (!name || !email) {
    alert("⚠️ الرجاء إدخال الاسم والبريد الإلكتروني");
    return;
  }

  const course = coursesData[selectedCourseIndex];

  // ===========================
  // ✅ تخزين التسجيل في LocalStorage
  // ===========================
  course.registrants.push({ name, phone, email, date: new Date().toISOString() });
  localStorage.setItem("coursesData", JSON.stringify(coursesData));

  // ===========================
  // ✅ تخزين التسجيل في Firebase مع اسم الدورة
  // ===========================
  database.ref('courses/' + selectedCourseIndex).push({
    name,
    phone,
    email,
    date: new Date().toISOString(),
    courseTitle: course.title
  })
  .then(() => {
    successTextCourse.innerHTML = `تم تسجيل <strong>${name}</strong> في دورة "<strong>${course.title}</strong>" بنجاح ✅`;
    formContainer.classList.add("hidden");
    successCourse.classList.remove("hidden");
    renderCourses();
  })
  .catch((error) => {
    alert('حدث خطأ أثناء الحفظ في Firebase: ' + error.message);
  });
});

// ===========================
// ✅ بعد إغلاق رسالة النجاح
// ===========================
doneCourse.addEventListener("click", () => {
  courseModal.classList.add("hidden");
  document.getElementById("courseName").value = "";
  document.getElementById("coursePhone").value = "";
  document.getElementById("courseEmail").value = "";
});

// ===========================
// ✅ عرض الدورات عند تحميل الصفحة
// ===========================
document.addEventListener("DOMContentLoaded", renderCourses);
