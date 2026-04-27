burdaqal.az

──────────────────────── GÜN SONU HESABATI — KOPYALA (başlanğıc) ────────────────────────
burdaqal.az — günün sonu
Tarix: 26 aprel 2026

1. Ana səhifə `SliderHome7` axtarışında justhome kimi açılan nəticə paneli (540px, təsviri siyahı, fokus/xaric klik) əlavə olundu.
2. `SliderHome7` axtarış zolğunun rəng/radiusu, boşluqları və açılan siyahıdakı mətn çəkişi şəkil dizaynına yaxınlaşdırıldı.
3. Ana səhifə axtarışında nəticə yoxdursa açılan paneldə «Axtarış nəticəsi tapılmadı» mesajı göstərilir.
4. Swiper üçün defolt mavi tema `Primary` rənginə keçirildi, oxlar kiçildildi; hero slayderində oxlar ağ, nöqtələr isə primary ilə vurğulanır.
5. `WorkWithUsHome` bölməsində kateqoriya filtrləri `/categories` API-sindən gəlir; seçimə görə elan siyahısı filtr olunur.
6. `globals.css`-də scrollbar justhome kimi: səhifə oxu gizli, daxili scrollarda nice-select üslublu incə boz track/thumb.
7. Footer «Subscribe» bloku alt xəttli e-poçt sahəsi və pill «Send» düyməsi ilə yeniləndi.
8. Mobil menyu justhome kimi sol 300px panel, loqo zolağı, tam ekran backdrop, sabit bağla düyməsi, nav/dil/hesab blokları və `globals.css` stilləri ilə uyğunlaşdırıldı.
9. Mobil menyuda `collapse` sinfi Tailwind `visibility:collapse` ilə məzmunu gizlətdiyi üçün silindi; nav, dil və hesab yenidən görünür.
10. Mobil menyunun bağlama düyməsi panelin içində, loqo sətrinin sağına keçirildi (tünd overlay üzərindəki ayrıca X ləğv edildi).
11. Ana səhifə `SliderHome7` mobil axtarış formu justhome ilə hizalandı: 24px radius, Filter + «Harda qalım?» həmişə yan-yana, Primary CTA ölçüsü, ağ placeholder, mobil filter paneli tam en.
12. `SliderHome7` açılan filter paneli böyüdüldü: 1022px-ə qədər en, daha böyük sahələr və Amenities (12 bənd, 3 sütun), scroll və bağlı vəziyyətdə kliklərin kəsilməsi.
13. Hero filter sahələri state və `/elanlar` URL parametrləri ilə bağlandı; API-ya əlavə sorğu sahələri ötürülür; `ElanlarListings` mövcud səhifədə yataq/hamam/qiymət/amenities üzrə müştəri tərəfi süzgəc tətbiq edir.
14. `SliderHome7` açıq filter panelində `pointer-events-none` + `pointer-events-auto` toqquşması səbəbindən sahələrə yazılmırdı; bağlı halda yalnız `pointer-events-none` qaldı.
15. Açılan filter paneli formun tam enində (`left-0` / `right-0`, tünd axtarış zolğu ilə eyni blok) yerləşdirildi; klik-xaric ref-ləri düymə + panel üçün ayrıldı.
16. `SliderHome7` filterində «İmkanlar» bloku `GET /attributes` + `groupAttributesByParent` ilə doldurulur; seçimlər URL/API üçün `attribute_ids` kimi ötürülür (köhnə `amenities` slug süzgəci saxlanıldı).
17. Genişləndirilmiş filter UI `PropertyAdvancedFilterPanel` modulunda birləşdirildi; `SliderHome7` təkrarlanan markupı bu komponentə keçirildi.
18. `/elanlar` səhifəsindəki filter formuna eyni «Filter» paneli (yataq, hamam, sahə, qiymət, imkanlar) və URL sinxronu əlavə olundu; göndərmə əsas parametrlərlə birləşir.
19. `SliderHome7` və `PropertyAdvancedFilterPanel` mətnləri `messages` fayllarına (`sliderHome7`, `propertyAdvancedFilter`) köçürüldü və `next-intl` ilə göstərilir.
20. Əlaqə səhifəsi, breadcrumb, istifadəçi menyusu, mobil menyu aria, «yuxarı» düyməsi və admin breadcrumb mətnləri `messages` üzərindən çoxdilli oldu.
21. Blog siyahısı, haqqımızda komanda/FAQ, yüklənmə skeletləri, OTP bloku və vaxt sahəsi tərcümə açarlarına keçirildi.
22. İdarə paneli yan menyusu, əsas səhifə statistikası/aktivlik, elanlarım cədvəli və profil formu (OTP modalı daxil) `next-intl` ilə lokalizə olundu.
23. Tək elan səhifəsi (`PropertySingleV5`) üzrə çörək, tablar, ümumi məlumat, xəritə/video və oxşar elanlar mətnləri mesaj fayllarına toplandı.
 ───────────────────────── GÜN SONU HESABATI — KOPYALA (son) ─────────────────────────

──────────────────────── GÜN SONU HESABATI — KOPYALA (başlanğıc) ────────────────────────
burdaqal.az — günün sonu
Tarix: 24 aprel 2026

1. justhome Header7/12 ilə eyni strukturda `HeaderHome` və `HeaderAbout` komponentləri Tailwind üslubunda yaradıldı; menyu, dil və hesab bloku birləşdirildi.
2. next-intl ilə justhome kimi `az`/`en`/`ru`, `localePrefix: as-needed`, middleware, `i18n/navigation` və `messages` faylları quraşdırıldı; menyu və header tərcümələrə keçirildi.
3. justhome ana səhifəsi (`Slider7`, rayonlar, elan şəbəkəsi, blog) Tailwind və qlobal CSS dəyişənləri ilə təkrarlandı; `Layout`, footer və mobil menyu əlavə olundu.
4. `SiteBrandingProvider`-ə `public/images/logo` üçün varsayılan loqolar verildi; header və footerdə loqo yenidən görünür.
5. Loqolar justhome kimi `GET /settings` ilə serverdə yüklənir və clientdə React Query ilə yenilənir; cavab boşdursa `public` faylları fallback qalır.
6. Ana səhifə və daxili səhifə headerində nav linkləri üç sütunlu grid ilə barın həqiqi mərkəzinə gətirildi; `Menu`-dakı köhnə `ml-[197px]` offset silindi.
7. Brauzer geri/ileri və BFCache bərpasından sonra API sorğuları yenidən işləsin deyə `QueryProvider`-də `pageshow`/`popstate` ilə sorğu keşinin invalidasiyası əlavə olundu.
8. `LoginPopup` və `RegisterPopup` justhome ilə eyni axınla dolduruldu (giriş, şifrə bərpası + OTP, qeydiyyat + təsdiq); `OtpSixDigitBlock` və `auth` tərcümələri əlavə olundu.
9. `useAuthSession`, `pickUserDisplay` və `GET /get-user` ilə `HeaderUserNav` yeniləndi: girişdən sonra ad, açılan menyuda email, Profilim/Dashboard/Çıxış; mobil menyu da eyni məlumatı göstərir.
10. justhome ilə eyni bloklarda `/about` səhifəsi (`layout` metadata, vision/mission, luxury blok, komanda swiperi, FAQ) və `Breadcrumb` `/breadcrumb` API ilə hero başlığına keçirildi.
11. `HeaderAbout` scroll zamanı `Header12` kimi `is-fixed is-small` sinifləri və `globals.css` ilə yapışan başlıq, mobil təhlükəsizlik boşluğu və sıxılmış loqo/blok kölgəsi tətbiq olundu.
12. `/bloglar` səhifəsi justhome ilə eyni məntiqdə (teq filtri, səhifələmə, kart şəbəkəsi, skelet) `HeaderAbout` layout ilə əlavə olundu; blog üçün metadata `layout`da API ilə seçilir.
13. `HeaderHome` yenidən justhome `Header7` / `_header.scss` ilə hizalandı: `is-fixed is-small`, `inner-wrap` scroll-da `Secondary`, `rounded-[24px]`, `tf-button-default.style-white`, mobil ağ bar.
14. `globals.css`-də `.style-no-bg` üçün scroll padding / fixed qabıq Header12 ilə uyğunlaşdırıldı; `inner-wrap` rəngi komponentdə qaldı, təkrar Tailwind padding silindi.
15. `HeaderHome` masaüstü şəbəkəsi `1fr auto 1fr` ilə yeniləndi ki, nav həmişə başlıqda vizual mərkəzdə olsun.
16. `/contact` səhifəsi justhome `ContactView` ilə eyni bloklar (xəritə, üç kart, forma) və `layout` metadata ilə əlavə olundu.
17. `/bloglar/[slug]` tək bloq səhifəsi (`BlogSingle`, skelet, oxşar yazılar, `generateMetadata`) justhome ilə uyğun əlavə olundu.
18. `/elanlar` səhifəsi justhome ilə eyni hero, çörək xırıltısı, axtarış/rayon/kateqoriya formu və swiper kart şəbəkəsi ilə əlavə olundu; URL sorğuları filtrlərlə sinxronlaşır.
19. `/elanlar/[slug]` tək elan səhifəsi justhome `PropertySingleV5` ilə (başlıq, şəkil+thumb swiper, overview, tab məzmunu, xəritə/video, oxşar elanlar, əlaqə bloku) və server `fetch` + `generateMetadata` ilə əlavə olundu.
20. justhome `LayoutAdmin` dashboard qabığı Tailwind ilə əlavə olundu (`LayoutAdmin`, `DashboardSidebar`, `BreadcrumbAdmin`); `/dashboard` nümunə səhifəsi və çıxış axını bağlandı.
21. `/dashboard` səhifəsi justhome ilə eyni bloklar (4 stat kartı, ApexCharts “View Statistics”, “Recent Activities” siyahısı, “View More”) və girişdə `Hello {ad}` başlığı ilə dolduruldu.
22. `/dashboard-add-properties` səhifəsi justhome `DashboardAddPropertiesClient` ilə (çoxaddımlı forma, media önizləmə, atribut şəbəkəsi, redaktə hydrate) Tailwind üslubunda əlavə olundu; `TimeDigitsInput` ayrıca komponentdir.
23. `/dashboard-my-profile` səhifəsi `LayoutAdmin` + `DashboardMyProfileClient` ilə (profil yeniləmə, şəkil yükləmə, e-poçt OTP modalı, şifrə dəyişmə) əlavə olundu.
24. `/dashboard-my-properties` istifadəçi elanları cədvəli, səhifələmə, silmə təsdiqi və `/dashboard-edit-property/[id]` redaktə marşrutu əlavə olundu.
 ───────────────────────── GÜN SONU HESABATI — KOPYALA (son) ─────────────────────────
