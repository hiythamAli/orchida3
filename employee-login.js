const loginBtn = document.getElementById('loginBtn');
const empCodeInput = document.getElementById('empCode');
const message = document.getElementById('message');

// الكود المعروف للموظف
const validCode = "A123";

loginBtn.addEventListener('click', () => {
    const code = empCodeInput.value.trim().toUpperCase(); // يتحول للحروف الكبيرة
    if (!code) {
        message.textContent = "الرجاء إدخال كود الموظف";
        return;
    }

    if (code === validCode) {
        message.style.color = "green";
        message.textContent = "تم تسجيل الدخول ✅";
        // تحويل الموظف إلى واجهة الموظفين
        window.location.href = "employee-dashboard.html"; // ضع هنا رابط واجهة الموظفين
    } else {
        message.style.color = "red";
        message.textContent = "كود غير صحيح ❌";
    }

    empCodeInput.value = '';
});
