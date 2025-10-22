// ====== بيانات المقاعد ======
const TOTAL_SEATS = 20;
let seats = JSON.parse(localStorage.getItem('seatsData')) || Array(TOTAL_SEATS).fill(null);

const seatsGrid = document.getElementById('seatsGrid');
const searchSeat = document.getElementById('searchSeat');

// ====== بيانات الدورات ======
let coursesData = JSON.parse(localStorage.getItem('coursesData')) || [
  { title: "أساسيات البرمجة الحديثة", duration: "4 أسابيع", seats: 30, registrants: [] },
  { title: "تصميم واجهات المستخدم UI/UX", duration: "6 أسابيع", seats: 20, registrants: [] },
  { title: "التسويق الرقمي وإدارة المحتوى", duration: "5 أسابيع", seats: 30, registrants: [] },
  { title: "مهارات الكتابة الاحترافية", duration: "3 أسابيع", seats: 25, registrants: [] }
];

const coursesGrid = document.getElementById('coursesGrid');
const searchCourse = document.getElementById('searchCourse');

// ====== عرض الأقسام ======
const seatsSection = document.getElementById('seatsSection');
const coursesSection = document.getElementById('coursesSection');
document.getElementById('showSeatsBtn').addEventListener('click', ()=>{
  seatsSection.classList.remove('hidden');
  coursesSection.classList.add('hidden');
});
document.getElementById('showCoursesBtn').addEventListener('click', ()=>{
  seatsSection.classList.add('hidden');
  coursesSection.classList.remove('hidden');
});

// ====== وظائف المقاعد ======
function renderSeats(filter=''){
  seatsGrid.innerHTML = '';
  seats.forEach((seat, idx)=>{
    if(seat && (seat.name.includes(filter) || seat.phone.includes(filter) || filter==='')){
      const card = document.createElement('div');
      card.className='seat-card glass';
      card.innerHTML=`
        <h3>مقعد ${idx+1}</h3>
        <p>الاسم: ${seat.name}</p>
        <p>الهاتف: ${seat.phone}</p>
        <p>البريد: ${seat.email}</p>
        <button class="btn edit-seat" data-id="${idx}">تعديل</button>
        <button class="btn danger delete-seat" data-id="${idx}">حذف</button>
      `;
      seatsGrid.appendChild(card);
    }
  });
}
renderSeats();

// تعديل وحذف المقاعد
seatsGrid.addEventListener('click',(e)=>{
  const idx = e.target.dataset.id;
  if(e.target.classList.contains('edit-seat')){
    const seat = seats[idx];
    const newName = prompt('الاسم:', seat.name);
    const newPhone = prompt('الهاتف:', seat.phone);
    const newEmail = prompt('البريد:', seat.email);
    if(newName && newPhone && newEmail){
      seats[idx] = { name:newName, phone:newPhone, email:newEmail, date:seat.date };
      localStorage.setItem('seatsData', JSON.stringify(seats));
      renderSeats(searchSeat.value);
    }
  }
  if(e.target.classList.contains('delete-seat')){
    if(confirm('هل تريد حذف هذا الحجز؟')){
      seats[idx] = null;
      localStorage.setItem('seatsData', JSON.stringify(seats));
      renderSeats(searchSeat.value);
    }
  }
});

searchSeat.addEventListener('input',()=>renderSeats(searchSeat.value));

// ====== وظائف الدورات ======
function renderCourses(filter=''){
  coursesGrid.innerHTML='';
  coursesData.forEach((course, idx)=>{
    const filteredRegistrants = course.registrants.filter(r=>r.name.includes(filter) || r.phone.includes(filter));
    const availableSeats = course.seats - course.registrants.length;

    const card = document.createElement('div');
    card.className='course-card glass';
    card.innerHTML=`
      <h3>${course.title}</h3>
      <p>المدة: ${course.duration}</p>
      <p>المقاعد المتاحة: ${availableSeats}</p>
      <h4>المسجلون:</h4>
      ${filteredRegistrants.length ? filteredRegistrants.map(r=>`<p>${r.name} - ${r.phone} - ${r.email} 
        <button class="btn edit-course" data-course="${idx}" data-email="${r.email}">تعديل</button>
        <button class="btn danger delete-course" data-course="${idx}" data-email="${r.email}">حذف</button>
      </p>`).join('') : '<p>لا يوجد مسجلون</p>'}
    `;
    coursesGrid.appendChild(card);
  });
}
renderCourses();

coursesGrid.addEventListener('click',(e)=>{
  const courseIdx = e.target.dataset.course;
  const email = e.target.dataset.email;
  if(e.target.classList.contains('edit-course')){
    const registrant = coursesData[courseIdx].registrants.find(r=>r.email===email);
    const newName = prompt('الاسم:', registrant.name);
    const newPhone = prompt('الهاتف:', registrant.phone);
    const newEmail = prompt('البريد:', registrant.email);
    if(newName && newPhone && newEmail){
      registrant.name=newName; registrant.phone=newPhone; registrant.email=newEmail;
      localStorage.setItem('coursesData', JSON.stringify(coursesData));
      renderCourses(searchCourse.value);
    }
  }
  if(e.target.classList.contains('delete-course')){
    if(confirm('هل تريد حذف هذا المسجل؟')){
      coursesData[courseIdx].registrants = coursesData[courseIdx].registrants.filter(r=>r.email!==email);
      localStorage.setItem('coursesData', JSON.stringify(coursesData));
      renderCourses(searchCourse.value);
    }
  }
});

searchCourse.addEventListener('input',()=>renderCourses(searchCourse.value));
