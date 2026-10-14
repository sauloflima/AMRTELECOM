# Assets da nova home

## Arquivos integrados

- `public/assets/generated/amr-casa-fibra-3d.png`: geração nativa Imagegen, PNG 1254 × 1254 com alfa.
- `public/assets/generated/amr-perfil-familia.jpg`: geração nativa Imagegen, exportação JPEG 1536 × 1024, qualidade 82.
- `public/assets/generated/amr-perfil-entretenimento.jpg`: geração nativa Imagegen, exportação JPEG 1536 × 1024, qualidade 82.
- `public/assets/photos/amr-perfil-trabalho.jpg`: fotografia de Liza Summer/Pexels, 1600 px. [Página original](https://www.pexels.com/hu-hu/foto/feny-konnyu-no-kave-6347902/), [imagem](https://images.pexels.com/photos/6347902/pexels-photo-6347902.jpeg?auto=compress&cs=tinysrgb&w=1600), [licença](https://www.pexels.com/license/). Uso ilustrativo, sem sugerir endosso da pessoa retratada.

Todos os arquivos originais anteriores permanecem preservados. As fotos ilustram perfis de uso, não são depoimentos nem fotografias de clientes da AMR.

## Prompts da geração nativa

### Casa

Use case: stylized-concept. Asset type: original website hero cutout, square 1536x1536 PNG with genuine transparent alpha background. Create a refined architectural 3D render of a complete contemporary Brazilian house seen in three-quarter perspective. White and navy facade, warm welcoming interior lighting visible through windows, tasteful electric-blue details. Subtle stylized WiFi waves over the house and fine fiber-optic lines arriving at its base, carefully controlled blue glow. Entire house visible with generous margins, centered composition. Elegant high quality materials and soft illumination, designed to blend into white or very pale blue website backgrounds. Actual transparent background, not a checkerboard or colored background. No text, letters, brand, logo, prices, watermark, or screenshot.

### Família

Use case: photorealistic-natural. Asset type: original editorial lifestyle photograph for an internet provider website, landscape 1536x1024. Two Brazilian adults and their child sitting together in a comfortable contemporary living room, naturally enjoying a tablet together. Genuine warm interaction, realistic Brazilian people, refined yet lived-in home, subtle blue elements in the decor, daylight and soft warm lighting. Candid editorial photography with realistic skin and fabric texture, calm premium atmosphere. Medium-wide composition fitting all three people with useful breathing room and safe margins for cropping to website cards. No readable screen content, no text, letters, logos, brands, price, watermark, or screenshot.

### Entretenimento

Use case: photorealistic-natural. Asset type: original editorial lifestyle photograph for an internet provider website, landscape 1536x1024. Young Brazilian adult holding a video game controller, enjoying a game in a comfortable contemporary living room at night. Restrained blue light balanced with warm ambient light, sophisticated quiet residential setting, realistic candid person, tactile realistic upholstery, editorial photography. Medium-wide composition and safe margins to crop as website cards. Understated atmosphere, not a neon gaming room. No legible screens, no text, letters, logos, brands, prices, watermark, or screenshot.

As tentativas de foto de trabalho e escritório 3D falharam com `usage_limit_reached`; não foram usadas nem repetidas. O escritório foi substituído pelo diagrama de conexão em `src/components/home-sections.mjs`, composto por ícones do próprio projeto e conexões SVG. Nenhum asset da Nio foi utilizado.
