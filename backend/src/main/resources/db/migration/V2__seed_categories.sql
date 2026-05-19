-- Varsayılan kategoriler (boş veritabanında yazı kaydı için gerekli)
INSERT INTO categories (name, slug)
VALUES ('Yazılım', 'yazilim'),
       ('Teknoloji', 'teknoloji'),
       ('Gündem', 'gundem'),
       ('Mühendislik', 'muhendislik'),
       ('Diğer', 'diger')
ON CONFLICT (name) DO NOTHING;
