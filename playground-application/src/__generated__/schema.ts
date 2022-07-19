/* eslint-disable */
import type { DocumentNode } from 'graphql';

const typeDefs: DocumentNode = JSON.parse(`{"kind":"Document","definitions":[{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"App","loc":{"start":5,"end":8}},"interfaces":[{"kind":"NamedType","name":{"kind":"Name","value":"Node","loc":{"start":20,"end":24}},"loc":{"start":20,"end":24}}],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"canonicalHost","loc":{"start":29,"end":42}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomHost","loc":{"start":44,"end":54}},"loc":{"start":44,"end":54}},"loc":{"start":44,"end":55}},"directives":[],"loc":{"start":29,"end":55}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deployments","loc":{"start":58,"end":69}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AppDeployment","loc":{"start":72,"end":85}},"loc":{"start":72,"end":85}},"loc":{"start":72,"end":86}},"loc":{"start":71,"end":87}},"loc":{"start":71,"end":88}},"directives":[],"loc":{"start":58,"end":88}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"id","loc":{"start":91,"end":93}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":95,"end":97}},"loc":{"start":95,"end":97}},"loc":{"start":95,"end":98}},"directives":[],"loc":{"start":91,"end":98}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"liveDeployment","loc":{"start":101,"end":115}},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"AppDeployment","loc":{"start":117,"end":130}},"loc":{"start":117,"end":130}},"directives":[],"loc":{"start":101,"end":130}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"manifest","loc":{"start":133,"end":141}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AppManifest","loc":{"start":143,"end":154}},"loc":{"start":143,"end":154}},"loc":{"start":143,"end":155}},"directives":[],"loc":{"start":133,"end":155}}],"loc":{"start":0,"end":157}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AppDeployment","loc":{"start":164,"end":177}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"bundle","loc":{"start":182,"end":188}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bundle","loc":{"start":190,"end":196}},"loc":{"start":190,"end":196}},"loc":{"start":190,"end":197}},"directives":[],"loc":{"start":182,"end":197}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"customHost","loc":{"start":200,"end":210}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomHost","loc":{"start":212,"end":222}},"loc":{"start":212,"end":222}},"loc":{"start":212,"end":223}},"directives":[],"loc":{"start":200,"end":223}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"delployedAt","loc":{"start":226,"end":237}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime","loc":{"start":239,"end":247}},"loc":{"start":239,"end":247}},"loc":{"start":239,"end":248}},"directives":[],"loc":{"start":226,"end":248}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name","loc":{"start":251,"end":255}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":257,"end":263}},"loc":{"start":257,"end":263}},"loc":{"start":257,"end":264}},"directives":[],"loc":{"start":251,"end":264}}],"loc":{"start":159,"end":266}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"AppManifest","loc":{"start":273,"end":284}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"icon","loc":{"start":289,"end":293}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"URL","loc":{"start":295,"end":298}},"loc":{"start":295,"end":298}},"loc":{"start":295,"end":299}},"directives":[],"loc":{"start":289,"end":299}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name","loc":{"start":302,"end":306}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":308,"end":314}},"loc":{"start":308,"end":314}},"loc":{"start":308,"end":315}},"directives":[],"loc":{"start":302,"end":315}}],"loc":{"start":268,"end":317}},{"kind":"UnionTypeDefinition","name":{"kind":"Name","value":"Bundle","loc":{"start":325,"end":331}},"directives":[],"types":[{"kind":"NamedType","name":{"kind":"Name","value":"BundleTemplate","loc":{"start":334,"end":348}},"loc":{"start":334,"end":348}},{"kind":"NamedType","name":{"kind":"Name","value":"BundleUpload","loc":{"start":351,"end":363}},"loc":{"start":351,"end":363}}],"loc":{"start":319,"end":363}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"BundleTemplate","loc":{"start":370,"end":384}},"interfaces":[{"kind":"NamedType","name":{"kind":"Name","value":"Node","loc":{"start":396,"end":400}},"loc":{"start":396,"end":400}}],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id","loc":{"start":405,"end":407}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":409,"end":411}},"loc":{"start":409,"end":411}},"loc":{"start":409,"end":412}},"directives":[],"loc":{"start":405,"end":412}}],"loc":{"start":365,"end":414}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"BundleUpload","loc":{"start":421,"end":433}},"interfaces":[{"kind":"NamedType","name":{"kind":"Name","value":"Node","loc":{"start":445,"end":449}},"loc":{"start":445,"end":449}}],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id","loc":{"start":454,"end":456}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":458,"end":460}},"loc":{"start":458,"end":460}},"loc":{"start":458,"end":461}},"directives":[],"loc":{"start":454,"end":461}}],"loc":{"start":416,"end":463}},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CreateAppInput","loc":{"start":471,"end":485}},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"appId","loc":{"start":490,"end":495}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":497,"end":503}},"loc":{"start":497,"end":503}},"loc":{"start":497,"end":504}},"directives":[],"loc":{"start":490,"end":504}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name","loc":{"start":507,"end":511}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":513,"end":519}},"loc":{"start":513,"end":519}},"loc":{"start":513,"end":520}},"directives":[],"loc":{"start":507,"end":520}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userProfileId","loc":{"start":523,"end":536}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":538,"end":540}},"loc":{"start":538,"end":540}},"loc":{"start":538,"end":541}},"directives":[],"loc":{"start":523,"end":541}}],"loc":{"start":465,"end":543}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CreateAppResult","loc":{"start":550,"end":565}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"app","loc":{"start":570,"end":573}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"App","loc":{"start":575,"end":578}},"loc":{"start":575,"end":578}},"loc":{"start":575,"end":579}},"directives":[],"loc":{"start":570,"end":579}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"customHost","loc":{"start":582,"end":592}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomHost","loc":{"start":594,"end":604}},"loc":{"start":594,"end":604}},"loc":{"start":594,"end":605}},"directives":[],"loc":{"start":582,"end":605}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"userProfile","loc":{"start":608,"end":619}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserProfile","loc":{"start":621,"end":632}},"loc":{"start":621,"end":632}},"loc":{"start":621,"end":633}},"directives":[],"loc":{"start":608,"end":633}}],"loc":{"start":545,"end":635}},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CreateUserProfileInput","loc":{"start":643,"end":665}},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"_","loc":{"start":670,"end":671}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":673,"end":679}},"loc":{"start":673,"end":679}},"directives":[],"loc":{"start":670,"end":679}}],"loc":{"start":637,"end":681}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CreateUserProfileResult","loc":{"start":688,"end":711}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"createApp","loc":{"start":716,"end":725}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"input","loc":{"start":726,"end":731}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserProfileResultCreateAppInput","loc":{"start":733,"end":770}},"loc":{"start":733,"end":770}},"loc":{"start":733,"end":771}},"directives":[],"loc":{"start":726,"end":771}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserProfileResultCreateAppResult","loc":{"start":774,"end":812}},"loc":{"start":774,"end":812}},"loc":{"start":774,"end":813}},"directives":[],"loc":{"start":716,"end":813}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"userProfile","loc":{"start":816,"end":827}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserProfile","loc":{"start":829,"end":840}},"loc":{"start":829,"end":840}},"loc":{"start":829,"end":841}},"directives":[],"loc":{"start":816,"end":841}}],"loc":{"start":683,"end":843}},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"CreateUserProfileResultCreateAppInput","loc":{"start":851,"end":888}},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"appId","loc":{"start":893,"end":898}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":900,"end":906}},"loc":{"start":900,"end":906}},"loc":{"start":900,"end":907}},"directives":[],"loc":{"start":893,"end":907}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name","loc":{"start":910,"end":914}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":916,"end":922}},"loc":{"start":916,"end":922}},"loc":{"start":916,"end":923}},"directives":[],"loc":{"start":910,"end":923}}],"loc":{"start":845,"end":925}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CreateUserProfileResultCreateAppResult","loc":{"start":932,"end":970}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"app","loc":{"start":975,"end":978}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"App","loc":{"start":980,"end":983}},"loc":{"start":980,"end":983}},"loc":{"start":980,"end":984}},"directives":[],"loc":{"start":975,"end":984}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"customHost","loc":{"start":987,"end":997}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomHost","loc":{"start":999,"end":1009}},"loc":{"start":999,"end":1009}},"loc":{"start":999,"end":1010}},"directives":[],"loc":{"start":987,"end":1010}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"userProfile","loc":{"start":1013,"end":1024}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserProfile","loc":{"start":1026,"end":1037}},"loc":{"start":1026,"end":1037}},"loc":{"start":1026,"end":1038}},"directives":[],"loc":{"start":1013,"end":1038}}],"loc":{"start":927,"end":1040}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"CustomHost","loc":{"start":1047,"end":1057}},"interfaces":[{"kind":"NamedType","name":{"kind":"Name","value":"Node","loc":{"start":1069,"end":1073}},"loc":{"start":1069,"end":1073}}],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id","loc":{"start":1078,"end":1080}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":1082,"end":1084}},"loc":{"start":1082,"end":1084}},"loc":{"start":1082,"end":1085}},"directives":[],"loc":{"start":1078,"end":1085}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"providerInfo","loc":{"start":1088,"end":1100}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"HostnameProviderInfo","loc":{"start":1102,"end":1122}},"loc":{"start":1102,"end":1122}},"loc":{"start":1102,"end":1123}},"directives":[],"loc":{"start":1088,"end":1123}}],"loc":{"start":1042,"end":1125}},{"kind":"ScalarTypeDefinition","name":{"kind":"Name","value":"DateTime","loc":{"start":1134,"end":1142}},"directives":[],"loc":{"start":1127,"end":1142}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"HostnameProviderInfo","loc":{"start":1149,"end":1169}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"healthCheckUrl","loc":{"start":1174,"end":1188}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"URL","loc":{"start":1190,"end":1193}},"loc":{"start":1190,"end":1193}},"loc":{"start":1190,"end":1194}},"directives":[],"loc":{"start":1174,"end":1194}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"hostname","loc":{"start":1197,"end":1205}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1207,"end":1213}},"loc":{"start":1207,"end":1213}},"loc":{"start":1207,"end":1214}},"directives":[],"loc":{"start":1197,"end":1214}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"managementUrl","loc":{"start":1217,"end":1230}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"URL","loc":{"start":1232,"end":1235}},"loc":{"start":1232,"end":1235}},"loc":{"start":1232,"end":1236}},"directives":[],"loc":{"start":1217,"end":1236}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"url","loc":{"start":1239,"end":1242}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"URL","loc":{"start":1244,"end":1247}},"loc":{"start":1244,"end":1247}},"loc":{"start":1244,"end":1248}},"directives":[],"loc":{"start":1239,"end":1248}}],"loc":{"start":1144,"end":1250}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation","loc":{"start":1257,"end":1265}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"createApp","loc":{"start":1270,"end":1279}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"input","loc":{"start":1280,"end":1285}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAppInput","loc":{"start":1287,"end":1301}},"loc":{"start":1287,"end":1301}},"loc":{"start":1287,"end":1302}},"directives":[],"loc":{"start":1280,"end":1302}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAppResult","loc":{"start":1305,"end":1320}},"loc":{"start":1305,"end":1320}},"loc":{"start":1305,"end":1321}},"directives":[],"loc":{"start":1270,"end":1321}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createUserProfile","loc":{"start":1324,"end":1341}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"input","loc":{"start":1342,"end":1347}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserProfileInput","loc":{"start":1349,"end":1371}},"loc":{"start":1349,"end":1371}},"loc":{"start":1349,"end":1372}},"defaultValue":{"kind":"ObjectValue","fields":[],"loc":{"start":1375,"end":1377}},"directives":[],"loc":{"start":1342,"end":1377}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserProfileResult","loc":{"start":1380,"end":1403}},"loc":{"start":1380,"end":1403}},"loc":{"start":1380,"end":1404}},"directives":[],"loc":{"start":1324,"end":1404}}],"loc":{"start":1252,"end":1406}},{"kind":"InterfaceTypeDefinition","name":{"kind":"Name","value":"Node","loc":{"start":1418,"end":1422}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id","loc":{"start":1427,"end":1429}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":1431,"end":1433}},"loc":{"start":1431,"end":1433}},"loc":{"start":1431,"end":1434}},"directives":[],"loc":{"start":1427,"end":1434}}],"loc":{"start":1408,"end":1436}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query","loc":{"start":1443,"end":1448}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"node","loc":{"start":1453,"end":1457}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id","loc":{"start":1458,"end":1460}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":1462,"end":1464}},"loc":{"start":1462,"end":1464}},"loc":{"start":1462,"end":1465}},"directives":[],"loc":{"start":1458,"end":1465}}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Node","loc":{"start":1468,"end":1472}},"loc":{"start":1468,"end":1472}},"directives":[],"loc":{"start":1453,"end":1472}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"userProfile","loc":{"start":1475,"end":1486}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id","loc":{"start":1487,"end":1489}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":1491,"end":1493}},"loc":{"start":1491,"end":1493}},"loc":{"start":1491,"end":1494}},"directives":[],"loc":{"start":1487,"end":1494}}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserProfile","loc":{"start":1497,"end":1508}},"loc":{"start":1497,"end":1508}},"directives":[],"loc":{"start":1475,"end":1508}}],"loc":{"start":1438,"end":1510}},{"kind":"ScalarTypeDefinition","name":{"kind":"Name","value":"URL","loc":{"start":1519,"end":1522}},"directives":[],"loc":{"start":1512,"end":1522}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"UserProfile","loc":{"start":1529,"end":1540}},"interfaces":[{"kind":"NamedType","name":{"kind":"Name","value":"Node","loc":{"start":1552,"end":1556}},"loc":{"start":1552,"end":1556}}],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"apps","loc":{"start":1561,"end":1565}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"App","loc":{"start":1568,"end":1571}},"loc":{"start":1568,"end":1571}},"loc":{"start":1568,"end":1572}},"loc":{"start":1567,"end":1573}},"loc":{"start":1567,"end":1574}},"directives":[],"loc":{"start":1561,"end":1574}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"id","loc":{"start":1577,"end":1579}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":1581,"end":1583}},"loc":{"start":1581,"end":1583}},"loc":{"start":1581,"end":1584}},"directives":[],"loc":{"start":1577,"end":1584}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name","loc":{"start":1587,"end":1591}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1593,"end":1599}},"loc":{"start":1593,"end":1599}},"loc":{"start":1593,"end":1600}},"directives":[],"loc":{"start":1587,"end":1600}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"profileImageUrl","loc":{"start":1603,"end":1618}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"URL","loc":{"start":1620,"end":1623}},"loc":{"start":1620,"end":1623}},"loc":{"start":1620,"end":1624}},"directives":[],"loc":{"start":1603,"end":1624}}],"loc":{"start":1524,"end":1626}}],"loc":{"start":0,"end":1626}}`);
export default typeDefs;