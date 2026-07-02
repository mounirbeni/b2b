import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "سياسة الخصوصية | دليل العيادات",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">سياسة الخصوصية</h1>
        <p className="text-sm text-muted-foreground">آخر تحديث: يوليوز 2026</p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold">1. البيانات التي نجمعها</h2>
            <p>
              الاسم، رقم الهاتف، البريد الإلكتروني (اختياري)، المدينة، وتفاصيل المواعيد المحجوزة (التاريخ
              والوقت والعيادة). <strong>لا نجمع أو نخزّن أي سجلات أو تشخيصات طبية</strong> — المنصة أداة حجز
              فقط، والمعلومات الطبية تبقى بين المريض والعيادة مباشرة.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">2. كيف نستخدم بياناتك</h2>
            <ul className="list-inside list-disc space-y-1">
              <li>لإنشاء وإدارة حسابك وحجوزاتك.</li>
              <li>لإرسال إشعارات تأكيد وتذكير بالمواعيد عبر واتساب (Twilio) بموافقتك الضمنية عند الحجز.</li>
              <li>لتمكين العيادة التي تحجز معها من الاطلاع على بيانات حجزك (الاسم والهاتف وتاريخ الموعد).</li>
              <li>لإعداد تقارير إحصائية مجمَّعة لصاحب العيادة (كعدد المواعيد)، دون مشاركتها مع أي طرف ثالث.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">3. مشاركة البيانات</h2>
            <p>
              لا نبيع بياناتك لأي طرف ثالث. نشارك الحد الأدنى الضروري من البيانات مع: العيادة التي تحجز معها
              موعداً، ومزوّد خدمة الرسائل (Twilio) لإرسال إشعارات واتساب فقط.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">4. حماية البيانات</h2>
            <p>
              تُشفَّر كلمات المرور ولا تُخزَّن كنص صريح. الاتصال بالمنصة يتم عبر HTTPS. مع ذلك، لا يمكن ضمان
              أمان مطلق لأي نظام معلوماتي عبر الإنترنت.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">5. حقوقك</h2>
            <p>
              وفق القانون رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي في
              المغرب، يحق لك الاطلاع على بياناتك وتصحيحها أو طلب حذفها، وذلك بالتواصل معنا عبر بيانات الاتصال
              المتوفرة على المنصة.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">6. الاحتفاظ بالبيانات</h2>
            <p>نحتفظ ببياناتك طالما حسابك نشطاً، ويمكنك طلب حذف حسابك وبياناته في أي وقت.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">7. ملفات تعريف الارتباط (Cookies)</h2>
            <p>
              نستخدم فقط ملفات تعريف ارتباط ضرورية لتسجيل الدخول والحفاظ على جلستك، ولا نستخدم أي أدوات تتبّع
              إعلاني من أطراف ثالثة.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold">8. تغييرات على هذه السياسة</h2>
            <p>قد نحدّث هذه السياسة من وقت لآخر، وسيُنشر أي تعديل جوهري على هذه الصفحة.</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
