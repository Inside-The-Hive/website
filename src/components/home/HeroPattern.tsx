/**
 * Decorative marks behind the hero.
 *
 * The hero is white with heavy display type on the left and a large empty
 * field on the right. This fills that field with texture rather than artwork:
 * a small vocabulary of abstract geometric marks — hexagons, zigzags, arcs,
 * squiggles, crosses, triangles, hatching, dots — scattered at varying sizes
 * and rotations.
 *
 * The hexagon is the anchor. It ties the pattern to the hive logo, so it
 * appears at roughly one mark in five and never tiles: honeycomb would read as
 * a texture swatch, where scattered and rotated it reads as one mark among
 * several that happens to recur.
 *
 * Two rules do most of the work:
 *
 *   Weight. The marks are a warm sand tone at full opacity rather than black
 *   at low opacity. Black thinned out goes grey and dirty against white; a
 *   light warm stroke stays clean and sits under the type without competing
 *   with it. Measured against the headline, ink on this sand is 16.1:1 — the
 *   pattern cannot pull the text below AA no matter which mark falls behind a
 *   letter.
 *
 *   Density. Sparse on the left where the headline sits, dense toward the
 *   upper right, so the pattern reads as drifting in from the edge rather than
 *   as wallpaper. The bottom third fades to nothing so it never collides with
 *   the image row beneath the hero.
 *
 * Coordinates are hand-authored, not generated: a random layout would differ
 * on every load and could not be checked. Nothing here animates.
 */



/**
 * The marks, in a 1200x800 user-space box.
 *
 * Packed tight and small — a few hundred marks with only a few pixels between
 * neighbours, so the field reads as a continuous texture rather than as
 * scattered ornaments. Most sit at 7-14 units; a scattering of larger ones
 * around 19-26 act as focal points.
 *
 * x runs 0 (behind the headline) to 1200 (the right edge), and density rises
 * with x, so the left stays open behind the type while the right fills in.
 *
 * Generated once by a seeded placement pass — collision-checked so no two
 * marks overlap — then frozen here as literal coordinates. Nothing random
 * runs in the browser, and the layout is identical on every load.
 */
type Mark = {
  d: string;
  /** Degrees, about the mark's own centre. */
  rotate?: number;
  cx?: number;
  cy?: number;
  /** Focal marks sit a little stronger than the rest. Still faint. */
  accent?: boolean;
  /** Solid dots are the only filled marks. */
  fill?: boolean;
  /** Dropped below 640px, halving the density on a phone. */
  dense?: boolean;
};

const MARKS: Mark[] = [
  { d: "M-1 15.9h32.5M-1 26.1h32.5M-1 36.2h32.5", rotate: 3, cx: 15.2, cy: 26.1, dense: true },
  { d: "M113 14.8L120.7 25L113 35.2L105.4 25Z", rotate: 39, cx: 113, cy: 25, dense: true },
  { d: "M188.4 17.4q4.1 -6.5 8.1 0t8.1 0", rotate: -19, cx: 196.5, cy: 17.4, dense: true },
  { d: "M343.8,16.1L338.4,25.6L327.4,25.6L321.9,16.1L327.4,6.6L338.4,6.6Z", rotate: -38, cx: 332.9, cy: 16.1 },
  { d: "M376.2 8V33.3M363.5 20.7H388.8", rotate: -6, cx: 376.2, cy: 20.7, dense: true },
  { d: "M432.8,26.5L428.5,34L419.8,34L415.5,26.5L419.8,19.1L428.5,19.1Z", rotate: -36, cx: 424.2, cy: 26.5 },
  { d: "M562.9 17.8L569.4 30.1L556.4 30.1Z", rotate: -18, cx: 562.9, cy: 25 },
  { d: "M607.9 13.2L617.2 25.6L607.9 38L598.6 25.6Z", rotate: 3, cx: 607.9, cy: 25.6 },
  { d: "M707.2 -3.1L718.6 18.5L695.7 18.5Z", rotate: 1, cx: 707.2, cy: 9.6 },
  { d: "M784.9 38.9l3.3 -8.6l3.3 8.6l3.3 -8.6l3.3 8.6l3.3 -8.6l3.3 8.6l3.3 -8.6l3.3 8.6l3.3 -8.6l3.3 8.6", rotate: 30, cx: 801.6, cy: 34.6 },
  { d: "M835.6 2.5L845.5 21.3L825.6 21.3Z", rotate: -23, cx: 835.6, cy: 13.5, dense: true },
  { d: "M900.5 29.4h16M900.5 34.4h16M900.5 39.4h16", rotate: -34, cx: 908.5, cy: 34.4 },
  { d: "M944.7 -3.9V23.6M931 9.8H958.5", rotate: 13, cx: 944.7, cy: 9.8, dense: true },
  { d: "M1006.5,28.9L1002.7,35.4L995.2,35.4L991.5,28.9L995.2,22.4L1002.7,22.4Z", rotate: -22, cx: 999, cy: 28.9 },
  { d: "M1104.3,28.2L1099.7,36L1090.7,36L1086.1,28.2L1090.7,20.3L1099.7,20.3Z", rotate: -33, cx: 1095.2, cy: 28.2 },
  { d: "M1146,32.4L1139.4,43.8L1126.3,43.8L1119.7,32.4L1126.3,21L1139.4,21Z", rotate: -37, cx: 1132.8, cy: 32.4, dense: true },
  { d: "M1181.1 30q3.7 -5.9 7.4 0t7.4 0", rotate: -25, cx: 1188.5, cy: 30 },
  { d: "M115.8 52.7L123 62.3L115.8 71.8L108.6 62.3Z", rotate: 33, cx: 115.8, cy: 62.3 },
  { d: "M252.7 78a8.5 8.5 0 0 1 17 0M256.1 78a5.1 5.1 0 0 1 10.2 0", rotate: 36, cx: 261.2, cy: 78 },
  { d: "M434.2 64.5L441.8 78.8L426.6 78.8Z", rotate: -37, cx: 434.2, cy: 72.9 },
  { d: "M636.2 47.5V62.4M628.7 54.9H643.6", rotate: 16, cx: 636.2, cy: 54.9 },
  { d: "M662.4 58.8V84.5M649.6 71.7H675.3", rotate: 20, cx: 662.4, cy: 71.7, dense: true },
  { d: "M697.4 69l3.8 -9.8l3.8 9.8l3.8 -9.8l3.8 9.8l3.8 -9.8l3.8 9.8", rotate: -36, cx: 708.8, cy: 64.1 },
  { d: "M832.3,60.5L825.9,71.5L813.2,71.5L806.9,60.5L813.2,49.4", rotate: 20, cx: 819.6, cy: 60.5, dense: true },
  { d: "M895.6,70.6L891.7,77.3L884,77.3L880.1,70.6L884,63.9L891.7,63.9Z", rotate: -19, cx: 887.8, cy: 70.6 },
  { d: "M961,69.5L949.3,89.8L925.8,89.8L914.1,69.5L925.8,49.2L949.3,49.2Z", rotate: 8, cx: 937.5, cy: 69.5 },
  { d: "M1037.1 34.2V85.2M1011.6 59.7H1062.7", rotate: 7, cx: 1037.1, cy: 59.7 },
  { d: "M1119.1 75.3q6.8 -11 13.7 0t13.7 0", rotate: 31, cx: 1132.8, cy: 75.3 },
  { d: "M1166.7 58.5q6 -9.6 11.9 0t11.9 0", rotate: 37, cx: 1178.6, cy: 58.5, dense: true },
  { d: "M147.5 117.6a14 14 0 0 1 27.9 0M153.1 117.6a8.4 8.4 0 0 1 16.8 0", rotate: -10, cx: 161.5, cy: 117.6 },
  { d: "M212.5,122.1L208.2,129.6L199.5,129.6L195.2,122.1L199.5,114.5L208.2,114.5Z", rotate: 18, cx: 203.8, cy: 122.1, dense: true },
  { d: "M311.4 110.1L322.2 130.6L300.6 130.6Z", rotate: 39, cx: 311.4, cy: 122.1, dense: true },
  { d: "M407.4,107L401.2,117.7L388.9,117.7L382.7,107", rotate: -10, cx: 395, cy: 107 },
  { d: "M400.2 129.5l7 -18.2l7 18.2l7 -18.2l7 18.2l7 -18.2l7 18.2l7 -18.2l7 18.2l7 -18.2l7 18.2", rotate: 39, cx: 435.4, cy: 120.4 },
  { d: "M485.2 96.7h14.9M485.2 101.4h14.9M485.2 106h14.9", rotate: 23, cx: 492.7, cy: 101.4, dense: true },
  { d: "M619 113.9V134.7M608.7 124.3H629.4", rotate: -37, cx: 619, cy: 124.3, dense: true },
  { d: "M734.8,111.9L730.1,120L720.7,120L716,111.9L720.7,103.8L730.1,103.8Z", rotate: -29, cx: 725.4, cy: 111.9 },
  { d: "M859.3 90V112.9M847.8 101.5H870.7", rotate: 23, cx: 859.3, cy: 101.5 },
  { d: "M886.2 106.1a12.4 12.4 0 0 1 24.7 0M891.2 106.1a7.4 7.4 0 0 1 14.8 0", rotate: 15, cx: 898.6, cy: 106.1, dense: true },
  { d: "M921.5 118.4a9.1 9.1 0 0 1 18.1 0M925.1 118.4a5.4 5.4 0 0 1 10.9 0", rotate: -23, cx: 930.6, cy: 118.4, dense: true },
  { d: "M980.4 90.4L990.1 108.7L970.7 108.7Z", rotate: 6, cx: 980.4, cy: 101.2 },
  { d: "M1054.7 125.1a21.7 21.7 0 0 1 21.7 -21.7", rotate: 1, cx: 1065.6, cy: 114.2, dense: true },
  { d: "M1124.2 107.6L1133.9 120.5L1124.2 133.4L1114.5 120.5Z", rotate: 16, cx: 1124.2, cy: 120.5, dense: true },
  { d: "M1152.3 123.2a19.9 19.9 0 0 1 19.9 -19.9", rotate: 14, cx: 1162.2, cy: 113.3, dense: true },
  { d: "M19.1,173.8L15.4,180.2L8,180.2L4.2,173.8L8,167.3", rotate: -8, cx: 11.7, cy: 173.8, dense: true },
  { d: "M141.1 161.4q5.7 -9.1 11.3 0t11.3 0", rotate: -33, cx: 152.4, cy: 161.4 },
  { d: "M240.1 166.3q4.2 -6.7 8.4 0t8.4 0", rotate: -37, cx: 248.5, cy: 166.3, dense: true },
  { d: "M511.8 154.2a11.3 11.3 0 0 1 22.5 0M516.3 154.2a6.8 6.8 0 0 1 13.5 0", rotate: 16, cx: 523.1, cy: 154.2 },
  { d: "M604.3 156.5h13.9M604.3 160.9h13.9M604.3 165.2h13.9", rotate: 31, cx: 611.3, cy: 160.9 },
  { d: "M738.7 157.3l3.8 -9.7l3.8 9.7l3.8 -9.7l3.8 9.7l3.8 -9.7l3.8 9.7", rotate: 15, cx: 750, cy: 152.4, dense: true },
  { d: "M810.8,164.8L805,174.9L793.3,174.9L787.4,164.8L793.3,154.6L805,154.6Z", rotate: 19, cx: 799.1, cy: 164.8 },
  { d: "M915.1,152.3L910.6,160.1L901.5,160.1L897,152.3L901.5,144.5L910.6,144.5Z", rotate: -16, cx: 906.1, cy: 152.3, dense: true },
  { d: "M929.1 145.5h20.4M929.1 151.9h20.4M929.1 158.3h20.4", rotate: 10, cx: 939.3, cy: 151.9, dense: true },
  { d: "M1109.3,162.6L1102.6,174.1L1089.3,174.1L1082.7,162.6L1089.3,151.1L1102.6,151.1Z", rotate: -11, cx: 1096, cy: 162.6 },
  { d: "M1116 154.3q6.4 -10.2 12.8 0t12.8 0", rotate: -1, cx: 1128.8, cy: 154.3 },
  { d: "M1185.4 148.8V163.5M1178.1 156.2H1192.8", rotate: -15, cx: 1185.4, cy: 156.2, dense: true },
  { d: "M375.3 222.3l2.3 -6l2.3 6l2.3 -6l2.3 6l2.3 -6l2.3 6l2.3 -6l2.3 6l2.3 -6l2.3 6", rotate: 17, cx: 387, cy: 219.3, dense: true },
  { d: "M527.6 211.2q4.2 -6.7 8.3 0t8.3 0", rotate: -30, cx: 536, cy: 211.2, dense: true },
  { d: "M611.1 219.5a13.9 13.9 0 0 1 27.9 0M616.7 219.5a8.4 8.4 0 0 1 16.7 0", rotate: -20, cx: 625.1, cy: 219.5, dense: true },
  { d: "M663.2 219.7a14 14 0 0 1 27.9 0M668.8 219.7a8.4 8.4 0 0 1 16.8 0", rotate: -32, cx: 677.2, cy: 219.7, dense: true },
  { d: "M696.4 207.4q6.8 -10.9 13.7 0t13.7 0", rotate: -6, cx: 710, cy: 207.4, dense: true },
  { d: "M754.9,214.7L749.9,223.2L740.1,223.2L735.2,214.7", rotate: -3, cx: 745, cy: 214.7 },
  { d: "M784.7 202h16.5M784.7 207.1h16.5M784.7 212.2h16.5", rotate: 6, cx: 793, cy: 207.1, dense: true },
  { d: "M895 223.3l3.8 -9.7l3.8 9.7l3.8 -9.7l3.8 9.7l3.8 -9.7l3.8 9.7", rotate: 3, cx: 906.3, cy: 218.4, dense: true },
  { d: "M977.4 195L986.7 212.5L968.1 212.5Z", rotate: 13, cx: 977.4, cy: 205.3 },
  { d: "M1044.6,218.1L1038.7,228.3L1026.8,228.3L1020.9,218.1", rotate: 26, cx: 1032.8, cy: 218.1 },
  { d: "M1067.1 186.7L1074.2 200.3L1059.9 200.3Z", rotate: -26, cx: 1067.1, cy: 194.7 },
  { d: "M1127.1 198.8L1137.7 218.8L1116.6 218.8Z", rotate: -34, cx: 1127.1, cy: 210.6 },
  { d: "M1164.4 201.3L1175.1 221.5L1153.7 221.5Z", rotate: -13, cx: 1164.4, cy: 213.2, dense: true },
  { d: "M93.5 260.9a27.3 27.3 0 0 1 27.3 -27.3", rotate: -35, cx: 107.1, cy: 247.3, dense: true },
  { d: "M145 259.7a8.9 8.9 0 0 1 17.9 0M148.6 259.7a5.4 5.4 0 0 1 10.7 0", rotate: 28, cx: 153.9, cy: 259.7, dense: true },
  { d: "M196.8 238.1V263.6M184.1 250.8H209.6", rotate: -33, cx: 196.8, cy: 250.8, dense: true },
  { d: "M419.1 253a19.8 19.8 0 0 1 19.8 -19.8", rotate: -19, cx: 429, cy: 243.1 },
  { d: "M686,257.3L673,279.8L647,279.8L634.1,257.3", rotate: -17, cx: 660, cy: 257.3, dense: true },
  { d: "M857.1 252.9V277.7M844.7 265.3H869.5", rotate: -39, cx: 857.1, cy: 265.3 },
  { d: "M917.8,258.6L912.6,267.6L902.2,267.6L897,258.6L902.2,249.7L912.6,249.7Z", rotate: -14, cx: 907.4, cy: 258.6 },
  { d: "M927.3 260.6q4.7 -7.5 9.4 0t9.4 0", rotate: 10, cx: 936.7, cy: 260.6 },
  { d: "M967.7 258l4.2 -10.8l4.2 10.8l4.2 -10.8l4.2 10.8l4.2 -10.8l4.2 10.8", rotate: 12, cx: 980.2, cy: 252.6, dense: true },
  { d: "M1022.9 268.4a16.2 16.2 0 0 1 16.2 -16.2", rotate: 33, cx: 1031.1, cy: 260.3, dense: true },
  { d: "M1077.3 250.8V267.6M1068.9 259.2H1085.7", rotate: -35, cx: 1077.3, cy: 259.2 },
  { d: "M1105.1 249.4a8.2 8.2 0 0 1 16.4 0M1108.3 249.4a4.9 4.9 0 0 1 9.9 0", rotate: 19, cx: 1113.3, cy: 249.4 },
  { d: "M1169.5 265.8a13.5 13.5 0 0 1 27.1 0M1175 265.8a8.1 8.1 0 0 1 16.2 0", rotate: 22, cx: 1183.1, cy: 265.8 },
  { d: "M137.9 300.3a24.4 24.4 0 0 1 24.4 -24.4", rotate: 11, cx: 150.1, cy: 288.1 },
  { d: "M365.4,313.7L358.6,325.6L344.8,325.6L337.9,313.7L344.8,301.8L358.6,301.8Z", rotate: 23, cx: 351.7, cy: 313.7, dense: true },
  { d: "M537.9 295.2L544.7 308L531.2 308Z", rotate: -29, cx: 537.9, cy: 302.7 },
  { d: "M579.4,307.6L575.3,314.9L566.9,314.9L562.8,307.6L566.9,300.4L575.3,300.4Z", rotate: 35, cx: 571.1, cy: 307.6, dense: true },
  { d: "M598.4 276.5h31.4M598.4 286.3h31.4M598.4 296.1h31.4", rotate: 2, cx: 614.1, cy: 286.3, dense: true },
  { d: "M748.6 312.3q5.9 -9.4 11.8 0t11.8 0", rotate: 35, cx: 760.3, cy: 312.3 },
  { d: "M862.6,292.4L857.2,301.7L846.6,301.7L841.2,292.4L846.6,283.2L857.2,283.2Z", rotate: -13, cx: 851.9, cy: 292.4 },
  { d: "M878.9 288.6q7 -11.1 13.9 0t13.9 0", rotate: 27, cx: 892.8, cy: 288.6 },
  { d: "M942.4 301.3h14.3M942.4 305.8h14.3M942.4 310.2h14.3", rotate: 5, cx: 949.6, cy: 305.8, dense: true },
  { d: "M980.3 283.6h21.6M980.3 290.4h21.6M980.3 297.1h21.6", rotate: -28, cx: 991, cy: 290.4, dense: true },
  { d: "M1026.4 286.7q6 -9.6 11.9 0t11.9 0", rotate: -6, cx: 1038.3, cy: 286.7, dense: true },
  { d: "M1053.7 301.8l2.5 -6.4l2.5 6.4l2.5 -6.4l2.5 6.4l2.5 -6.4l2.5 6.4l2.5 -6.4l2.5 6.4l2.5 -6.4l2.5 6.4", rotate: 22, cx: 1066, cy: 298.6 },
  { d: "M1113 313.4q3.6 -5.8 7.2 0t7.2 0", rotate: -36, cx: 1120.2, cy: 313.4, dense: true },
  { d: "M1151.8 309.4a20.6 20.6 0 0 1 41.2 0M1160 309.4a12.4 12.4 0 0 1 24.7 0", rotate: 8, cx: 1172.4, cy: 309.4 },
  { d: "M73.5 320.8V346M60.9 333.4H86.1", rotate: -30, cx: 73.5, cy: 333.4, dense: true },
  { d: "M150.8 334.8h11.4M150.8 338.3h11.4M150.8 341.9h11.4", rotate: -23, cx: 156.5, cy: 338.3 },
  { d: "M191.4 348.8q6.5 -10.4 13 0t13 0", rotate: -36, cx: 204.4, cy: 348.8 },
  { d: "M250.5,347.2L246.8,353.7L239.3,353.7L235.6,347.2L239.3,340.7L246.8,340.7Z", rotate: -27, cx: 243.1, cy: 347.2, dense: true },
  { d: "M337.2 348.5a11.5 11.5 0 0 1 22.9 0M341.8 348.5a6.9 6.9 0 0 1 13.8 0", rotate: 11, cx: 348.7, cy: 348.5, dense: true },
  { d: "M412.2,358.8L407.8,366.4L399,366.4L394.6,358.8L399,351.2L407.8,351.2Z", rotate: 6, cx: 403.4, cy: 358.8, dense: true },
  { d: "M477.3 348.1h22.3M477.3 355.1h22.3M477.3 362h22.3" },
  { d: "M526.7 354.9a7.9 7.9 0 0 1 15.8 0M529.9 354.9a4.7 4.7 0 0 1 9.5 0", rotate: -18, cx: 534.6, cy: 354.9, dense: true },
  { d: "M572.6 349.6l4 -10.2l4 10.2l4 -10.2l4 10.2l4 -10.2l4 10.2l4 -10.2l4 10.2", rotate: -31, cx: 588.4, cy: 344.5, dense: true },
  { d: "M633.3 337.4L643.1 350.5L633.3 363.6L623.5 350.5Z", rotate: 34, cx: 633.3, cy: 350.5 },
  { d: "M712 325L720.6 336.5L712 348.1L703.3 336.5Z", rotate: 18, cx: 712, cy: 336.5, dense: true },
  { d: "M862.7,334.5L857.7,343.1L847.8,343.1L842.8,334.5L847.8,325.8L857.7,325.8Z", rotate: -24, cx: 852.7, cy: 334.5 },
  { d: "M893.7,353.5L888.8,362L878.9,362L874,353.5L878.9,345L888.8,345Z", rotate: -5, cx: 883.8, cy: 353.5, dense: true },
  { d: "M933.8 332.9L942.6 349.6L925 349.6Z", rotate: -1, cx: 933.8, cy: 342.7 },
  { d: "M986.2 368.8a17.5 17.5 0 0 1 17.5 -17.5", rotate: 4, cx: 995, cy: 360.1, dense: true },
  { d: "M1035.3 341a11.7 11.7 0 0 1 23.3 0M1040 341a7 7 0 0 1 14 0", rotate: -6, cx: 1047, cy: 341, dense: true },
  { d: "M1073.1 335.6a13.6 13.6 0 0 1 27.3 0M1078.5 335.6a8.2 8.2 0 0 1 16.4 0", rotate: -28, cx: 1086.7, cy: 335.6 },
  { d: "M1107.6 335.4h21.6M1107.6 342.1h21.6M1107.6 348.9h21.6", rotate: 4, cx: 1118.4, cy: 342.1 },
  { d: "M160.6,382.4L156.9,388.7L149.7,388.7L146.1,382.4L149.7,376.1L156.9,376.1Z", rotate: -27, cx: 153.3, cy: 382.4 },
  { d: "M300.1,396.8L295.9,404L287.5,404L283.3,396.8L287.5,389.5", rotate: -13, cx: 291.7, cy: 396.8, dense: true },
  { d: "M374.8,404.1L364.1,422.6L342.7,422.6L332,404.1L342.7,385.5", rotate: -15, cx: 353.4, cy: 404.1 },
  { d: "M409.8 417.6a27 27 0 0 1 27 -27", rotate: 35, cx: 423.3, cy: 404.1 },
  { d: "M456.5 377.3a11.2 11.2 0 0 1 22.4 0M461 377.3a6.7 6.7 0 0 1 13.4 0", rotate: 5, cx: 467.7, cy: 377.3 },
  { d: "M552.1 377.9h32.2M552.1 387.9h32.2M552.1 398h32.2", rotate: 18, cx: 568.2, cy: 387.9, accent: true, dense: true },
  { d: "M649.6 379.8q5.8 -9.2 11.6 0t11.6 0", rotate: -32, cx: 661.1, cy: 379.8 },
  { d: "M687 371.1h21.9M687 378h21.9M687 384.8h21.9", rotate: 2, cx: 697.9, cy: 378, dense: true },
  { d: "M894.9 381.2L900.8 389L894.9 396.8L889.1 389Z", rotate: 27, cx: 894.9, cy: 389 },
  { d: "M929.8 385.1l4.2 -10.8l4.2 10.8l4.2 -10.8l4.2 10.8l4.2 -10.8l4.2 10.8", rotate: 13, cx: 942.3, cy: 379.7, dense: true },
  { d: "M982.4 368.4V392.5M970.4 380.4H994.4", rotate: -35, cx: 982.4, cy: 380.4 },
  { d: "M1023.2 373.5L1029.3 381.6L1023.2 389.7L1017.2 381.6Z", rotate: 6, cx: 1023.2, cy: 381.6 },
  { d: "M1085.1 397.9l3.5 -8.9l3.5 8.9l3.5 -8.9l3.5 8.9l3.5 -8.9l3.5 8.9", rotate: -18, cx: 1095.4, cy: 393.4, dense: true },
  { d: "M1103.2 398.4l3.7 -9.5l3.7 9.5l3.7 -9.5l3.7 9.5l3.7 -9.5l3.7 9.5l3.7 -9.5l3.7 9.5l3.7 -9.5l3.7 9.5", rotate: -36, cx: 1121.7, cy: 393.6 },
  { d: "M1183.7,403.7L1177.1,415.1L1164,415.1L1157.4,403.7L1164,392.3L1177.1,392.3Z", rotate: 16, cx: 1170.5, cy: 403.7, dense: true },
  { d: "M-0.6 442.1a9.3 9.3 0 0 1 18.6 0M3.2 442.1a5.6 5.6 0 0 1 11.2 0", rotate: 20, cx: 8.7, cy: 442.1, dense: true },
  { d: "M152.1 428.1a8.2 8.2 0 0 1 16.5 0M155.3 428.1a4.9 4.9 0 0 1 9.9 0", rotate: 10, cx: 160.3, cy: 428.1 },
  { d: "M210.1 432.7a8.8 8.8 0 0 1 17.5 0M213.6 432.7a5.3 5.3 0 0 1 10.5 0", rotate: -15, cx: 218.8, cy: 432.7, dense: true },
  { d: "M247.2 440.8l3.9 -10.1l3.9 10.1l3.9 -10.1l3.9 10.1l3.9 -10.1l3.9 10.1", rotate: -7, cx: 258.9, cy: 435.7, dense: true },
  { d: "M379.9 416.4L389.7 434.9L370.1 434.9Z", rotate: -21, cx: 379.9, cy: 427.3 },
  { d: "M426.5 435.4q12.5 -20 24.9 0t24.9 0", rotate: 36, cx: 451.4, cy: 435.4 },
  { d: "M563.4 421.4V441.3M553.4 431.3H573.3", rotate: 31, cx: 563.4, cy: 431.3, dense: true },
  { d: "M657.2 448.1l2.6 -6.6l2.6 6.6l2.6 -6.6l2.6 6.6l2.6 -6.6l2.6 6.6", rotate: -13, cx: 664.8, cy: 444.8 },
  { d: "M719.7 448.6a15 15 0 0 1 15 -15", rotate: 33, cx: 727.2, cy: 441.1 },
  { d: "M745.2 445.6a11.7 11.7 0 0 1 23.4 0M749.9 445.6a7 7 0 0 1 14 0", rotate: 16, cx: 756.9, cy: 445.6 },
  { d: "M791 429.9L801 443.3L791 456.7L781 443.3Z", rotate: -17, cx: 791, cy: 443.3, dense: true },
  { d: "M829.2 462.5a24.8 24.8 0 0 1 24.8 -24.8", rotate: 13, cx: 841.6, cy: 450.1 },
  { d: "M925.6 439.5h16.2M925.6 444.6h16.2M925.6 449.6h16.2", rotate: -32, cx: 933.7, cy: 444.6 },
  { d: "M985 460.5a25.3 25.3 0 0 1 25.3 -25.3", rotate: 9, cx: 997.6, cy: 447.9 },
  { d: "M1023.5 435.6V456.9M1012.9 446.3H1034.1", rotate: 27, cx: 1023.5, cy: 446.3, dense: true },
  { d: "M1129.6 417.9L1135.5 425.7L1129.6 433.5L1123.8 425.7Z", rotate: -10, cx: 1129.6, cy: 425.7, dense: true },
  { d: "M1153.9 455.5a22 22 0 0 1 22 -22", rotate: 38, cx: 1164.8, cy: 444.5 },
  { d: "M95.9 493q6.6 -10.5 13.1 0t13.1 0", rotate: 24, cx: 109, cy: 493 },
  { d: "M336.4 467.6q4.7 -7.5 9.3 0t9.3 0", rotate: 28, cx: 345.7, cy: 467.6 },
  { d: "M387 480h11.8M387 483.7h11.8M387 487.4h11.8", rotate: -11, cx: 392.9, cy: 483.7 },
  { d: "M434.7 486.5L444.4 504.8L425 504.8Z", rotate: 22, cx: 434.7, cy: 497.3, dense: true },
  { d: "M504.9,480.8L493.6,500.4L471,500.4L459.7,480.8", rotate: -7, cx: 482.3, cy: 480.8 },
  { d: "M515.3 484.6q3.9 -6.2 7.8 0t7.8 0", rotate: -38, cx: 523.1, cy: 484.6 },
  { d: "M587,483.7L581.4,493.4L570.1,493.4L564.5,483.7L570.1,473.9L581.4,473.9Z", rotate: 10, cx: 575.7, cy: 483.7, dense: true },
  { d: "M615.6 491.3a7.8 7.8 0 0 1 15.6 0M618.7 491.3a4.7 4.7 0 0 1 9.4 0", rotate: 3, cx: 623.4, cy: 491.3 },
  { d: "M764 471.7L773.7 490L754.2 490Z", rotate: -12, cx: 764, cy: 482.5, dense: true },
  { d: "M779.5 487.6q11.1 -17.8 22.3 0t22.3 0", rotate: -3, cx: 801.8, cy: 487.6, accent: true, dense: true },
  { d: "M843 501.3l4.1 -10.5l4.1 10.5l4.1 -10.5l4.1 10.5l4.1 -10.5l4.1 10.5l4.1 -10.5l4.1 10.5", rotate: -8, cx: 859.2, cy: 496 },
  { d: "M884.9 499a19.4 19.4 0 0 1 19.4 -19.4", rotate: 34, cx: 894.6, cy: 489.3 },
  { d: "M943.8 467.2V483M935.9 475.1H951.7", rotate: 21, cx: 943.8, cy: 475.1, dense: true },
  { d: "M987.7 490.7a10.2 10.2 0 0 1 20.4 0M991.8 490.7a6.1 6.1 0 0 1 12.2 0", rotate: -15, cx: 997.9, cy: 490.7, dense: true },
  { d: "M1052,483.4L1042.4,500L1023.2,500L1013.6,483.4L1023.2,466.7L1042.4,466.7Z", rotate: 29, cx: 1032.8, cy: 483.4, accent: true, dense: true },
  { d: "M1071.5 488.1L1079 502.3L1064 502.3Z", rotate: -39, cx: 1071.5, cy: 496.4 },
  { d: "M1119.7 476.8L1128 492.6L1111.3 492.6Z", rotate: -17, cx: 1119.7, cy: 486.1 },
  { d: "M1172.2 486.8L1179 495.9L1172.2 505L1165.4 495.9Z", rotate: 6, cx: 1172.2, cy: 495.9, dense: true },
  { d: "M22.3,534.1L16.1,544.9L3.7,544.9L-2.5,534.1L3.7,523.4L16.1,523.4Z", rotate: 9, cx: 9.9, cy: 534.1 },
  { d: "M200.2,539.8L196,547L187.6,547L183.5,539.8L187.6,532.5L196,532.5Z", rotate: 26, cx: 191.8, cy: 539.8 },
  { d: "M257.3 551.3a16.1 16.1 0 0 1 16.1 -16.1", rotate: -27, cx: 265.4, cy: 543.2, dense: true },
  { d: "M371.1,540.9L365.1,551.2L353.2,551.2L347.2,540.9L353.2,530.5L365.1,530.5Z", rotate: 5, cx: 359.1, cy: 540.9, dense: true },
  { d: "M492.6,538.8L488.3,546.3L479.6,546.3L475.3,538.8L479.6,531.4L488.3,531.4Z", rotate: -2, cx: 484, cy: 538.8, dense: true },
  { d: "M587.5 538.4q9.6 -15.4 19.2 0t19.2 0", rotate: 26, cx: 606.7, cy: 538.4, accent: true, dense: true },
  { d: "M678.5 527.2V552.8M665.7 540H691.3", rotate: 10, cx: 678.5, cy: 540 },
  { d: "M719.7,519.4L715,527.4L705.7,527.4L701.1,519.4L705.7,511.3L715,511.3Z", rotate: 5, cx: 710.4, cy: 519.4 },
  { d: "M762.4 512.1V538.9M749 525.5H775.8", rotate: 17, cx: 762.4, cy: 525.5 },
  { d: "M842.6 529.3V549.5M832.5 539.4H852.7", rotate: 8, cx: 842.6, cy: 539.4, dense: true },
  { d: "M887.5 555.4a43.5 43.5 0 0 1 43.5 -43.5", rotate: 24, cx: 909.2, cy: 533.7, accent: true },
  { d: "M992 524.4L1000.5 535.7L992 547L983.5 535.7Z", rotate: -25, cx: 992, cy: 535.7 },
  { d: "M1086.5 514.9L1093.7 524.6L1086.5 534.2L1079.3 524.6Z", rotate: -1, cx: 1086.5, cy: 524.6 },
  { d: "M1127.1 524V549.2M1114.5 536.6H1139.7", rotate: 34, cx: 1127.1, cy: 536.6, dense: true },
  { d: "M1168.6 537.3q5.8 -9.3 11.6 0t11.6 0", dense: true },
  { d: "M139.7 579.5h16.6M139.7 584.7h16.6M139.7 589.9h16.6", rotate: 22, cx: 148, cy: 584.7 },
  { d: "M285.6 570a8.9 8.9 0 0 1 17.7 0M289.2 570a5.3 5.3 0 0 1 10.6 0", rotate: 14, cx: 294.5, cy: 570 },
  { d: "M445.1,567.8L441,574.8L432.9,574.8L428.9,567.8", rotate: 30, cx: 437, cy: 567.8 },
  { d: "M561 566.9h38.8M561 579h38.8M561 591.2h38.8", rotate: 9, cx: 580.4, cy: 579, accent: true, dense: true },
  { d: "M622.8 575.5L632.2 593.3L613.3 593.3Z", rotate: 18, cx: 622.8, cy: 586, dense: true },
  { d: "M657.6 575.5a11.3 11.3 0 0 1 22.5 0M662.1 575.5a6.8 6.8 0 0 1 13.5 0", rotate: -37, cx: 668.9, cy: 575.5 },
  { d: "M732.1,566.6L727.1,575.3L717.1,575.3L712.2,566.6L717.1,558L727.1,558Z", rotate: 1, cx: 722.1, cy: 566.6 },
  { d: "M738.2 583.3l3.5 -9.1l3.5 9.1l3.5 -9.1l3.5 9.1l3.5 -9.1l3.5 9.1l3.5 -9.1l3.5 9.1", rotate: -19, cx: 752.3, cy: 578.7 },
  { d: "M788.6 579.2a18.8 18.8 0 0 1 18.8 -18.8", rotate: 14, cx: 798, cy: 569.8, dense: true },
  { d: "M896.7 579.3a14.7 14.7 0 0 1 14.7 -14.7", rotate: 12, cx: 904.1, cy: 571.9 },
  { d: "M984.3 556.6V580M972.6 568.3H996", rotate: -35, cx: 984.3, cy: 568.3, dense: true },
  { d: "M1012.2 564.3q10.7 -17.2 21.5 0t21.5 0", rotate: -12, cx: 1033.7, cy: 564.3, accent: true },
  { d: "M1094.5 566.5L1109.6 586.7L1094.5 606.9L1079.3 586.7Z", rotate: -21, cx: 1094.5, cy: 586.7, accent: true, dense: true },
  { d: "M1164.5 580.8l4 -10.4l4 10.4l4 -10.4l4 10.4l4 -10.4l4 10.4l4 -10.4l4 10.4l4 -10.4l4 10.4", rotate: -11, cx: 1184.6, cy: 575.6 },
  { d: "M90.2,627.7L79.6,646L58.4,646L47.8,627.7L58.4,609.3L79.6,609.3Z", rotate: -3, cx: 69, cy: 627.7, accent: true },
  { d: "M164.8 633.3q5.4 -8.7 10.8 0t10.8 0", rotate: 17, cx: 175.7, cy: 633.3, dense: true },
  { d: "M196.6 635a25.3 25.3 0 0 1 25.3 -25.3", rotate: 18, cx: 209.3, cy: 622.3, dense: true },
  { d: "M247 602L252.9 610L247 618L241 610Z", rotate: 24, cx: 247, cy: 610 },
  { d: "M293.1 630.7a12.4 12.4 0 0 1 24.8 0M298.1 630.7a7.4 7.4 0 0 1 14.9 0", rotate: 13, cx: 305.5, cy: 630.7 },
  { d: "M333.1 620.4L338.6 627.8L333.1 635.1L327.6 627.8Z", rotate: 2, cx: 333.1, cy: 627.8 },
  { d: "M493.6 608.2V635.5M480 621.8H507.2", rotate: 11, cx: 493.6, cy: 621.8 },
  { d: "M584.2 622.7V644.9M573.1 633.8H595.3", rotate: -33, cx: 584.2, cy: 633.8 },
  { d: "M764.7 602.7L773.2 614.1L764.7 625.4L756.1 614.1Z", rotate: -37, cx: 764.7, cy: 614.1 },
  { d: "M856.2 622.4l2.6 -6.8l2.6 6.8l2.6 -6.8l2.6 6.8l2.6 -6.8l2.6 6.8", rotate: -7, cx: 864.2, cy: 619, dense: true },
  { d: "M908.9 605.1L926.8 628.9L908.9 652.7L891.1 628.9Z", rotate: -12, cx: 908.9, cy: 628.9, dense: true },
  { d: "M937.6 622.2a7.3 7.3 0 0 1 14.5 0M940.5 622.2a4.4 4.4 0 0 1 8.7 0", rotate: 31, cx: 944.8, cy: 622.2 },
  { d: "M999.4,616.5L993,627.7L980.1,627.7L973.6,616.5", rotate: -3, cx: 986.5, cy: 616.5 },
  { d: "M1035.1 612.9a12.7 12.7 0 0 1 25.4 0M1040.2 612.9a7.6 7.6 0 0 1 15.2 0", rotate: 6, cx: 1047.8, cy: 612.9, dense: true },
  { d: "M1110.9 633.6q5.9 -9.5 11.8 0t11.8 0", rotate: -16, cx: 1122.8, cy: 633.6, dense: true },
  { d: "M1165.3 602.3L1172 614.9L1158.6 614.9Z", rotate: -19, cx: 1165.3, cy: 609.7 },
  { d: "M154.8 692.9a27.9 27.9 0 0 1 27.9 -27.9", rotate: 24, cx: 168.8, cy: 678.9, dense: true },
  { d: "M401.7 662.7V685.8M390.1 674.2H413.2", rotate: -29, cx: 401.7, cy: 674.2, dense: true },
  { d: "M429.5 677.5a20.4 20.4 0 0 1 20.4 -20.4", rotate: -3, cx: 439.6, cy: 667.4 },
  { d: "M485.2 653.8L493.6 669.6L476.8 669.6Z", rotate: 33, cx: 485.2, cy: 663.1, dense: true },
  { d: "M562.4 662.9L569.5 676.2L555.4 676.2Z", rotate: 23, cx: 562.4, cy: 670.8, dense: true },
  { d: "M621.4 658.7a14 14 0 0 1 14 -14", rotate: -7, cx: 628.5, cy: 651.6, dense: true },
  { d: "M653.6 667.6L661.8 678.6L653.6 689.6L645.3 678.6Z", rotate: 20, cx: 653.6, cy: 678.6, dense: true },
  { d: "M759.7 666.6L769.6 685.3L749.8 685.3Z", rotate: 12, cx: 759.7, cy: 677.6 },
  { d: "M792.9 672.3q5.7 -9.1 11.3 0t11.3 0", rotate: -23, cx: 804.3, cy: 672.3 },
  { d: "M846.6 694.1a24.9 24.9 0 0 1 24.9 -24.9", rotate: -14, cx: 859.1, cy: 681.6, dense: true },
  { d: "M898.1 681.3a25.7 25.7 0 0 1 25.7 -25.7", rotate: -34, cx: 911, cy: 668.5, dense: true },
  { d: "M986.9,661.4L983,668.1L975.3,668.1L971.5,661.4L975.3,654.7L983,654.7Z", rotate: -37, cx: 979.2, cy: 661.4, dense: true },
  { d: "M1021 668.3L1029.1 679.1L1021 689.9L1012.9 679.1Z", rotate: 3, cx: 1021, cy: 679.1, dense: true },
  { d: "M1062.1 667a10.5 10.5 0 0 1 21 0M1066.3 667a6.3 6.3 0 0 1 12.6 0", rotate: 4, cx: 1072.6, cy: 667 },
  { d: "M1137.8 643.2L1145.6 653.6L1137.8 664L1130 653.6Z", rotate: -15, cx: 1137.8, cy: 653.6 },
  { d: "M1163.6 676.4q4.2 -6.7 8.4 0t8.4 0", rotate: 33, cx: 1171.9, cy: 676.4 },
  { d: "M114.4 713.2L123.2 724.8L114.4 736.5L105.7 724.8Z", rotate: 24, cx: 114.4, cy: 724.8 },
  { d: "M393.6,725.5L387.5,736.1L375.3,736.1L369.2,725.5L375.3,715L387.5,715Z", rotate: -39, cx: 381.4, cy: 725.5 },
  { d: "M462.8,713.7L456.8,724.1L444.7,724.1L438.7,713.7", rotate: -14, cx: 450.7, cy: 713.7 },
  { d: "M531.6 697.5h22.4M531.6 704.5h22.4M531.6 711.5h22.4", rotate: -25, cx: 542.8, cy: 704.5 },
  { d: "M630.2,726.7L624.5,736.6L613.1,736.6L607.4,726.7", rotate: -11, cx: 618.8, cy: 726.7 },
  { d: "M717.2,720.3L711.2,730.7L699.2,730.7L693.2,720.3L699.2,709.9L711.2,709.9Z", rotate: 10, cx: 705.2, cy: 720.3, dense: true },
  { d: "M778,714.2L773.7,721.6L765.2,721.6L760.9,714.2L765.2,706.8L773.7,706.8Z", rotate: -13, cx: 769.5, cy: 714.2 },
  { d: "M808 729.1l2.8 -7.2l2.8 7.2l2.8 -7.2l2.8 7.2l2.8 -7.2l2.8 7.2l2.8 -7.2l2.8 7.2", rotate: -4, cx: 819.1, cy: 725.5 },
  { d: "M833.6 709.4a13.5 13.5 0 0 1 27.1 0M839 709.4a8.1 8.1 0 0 1 16.3 0", rotate: -5, cx: 847.1, cy: 709.4, dense: true },
  { d: "M904,713.4L897.3,725L884,725L877.3,713.4L884,701.8L897.3,701.8Z", rotate: -36, cx: 890.6, cy: 713.4, dense: true },
  { d: "M935.2 720.1a12.5 12.5 0 0 1 24.9 0M940.2 720.1a7.5 7.5 0 0 1 14.9 0", rotate: -20, cx: 947.7, cy: 720.1 },
  { d: "M979.8 720.4a27.5 27.5 0 0 1 27.5 -27.5", rotate: 4, cx: 993.5, cy: 706.6, dense: true },
  { d: "M1013 724.8l3 -7.7l3 7.7l3 -7.7l3 7.7l3 -7.7l3 7.7l3 -7.7l3 7.7l3 -7.7l3 7.7", rotate: 40, cx: 1028, cy: 720.9, dense: true },
  { d: "M1082.7 689L1091 704.8L1074.3 704.8Z", rotate: -9, cx: 1082.7, cy: 698.3, dense: true },
  { d: "M1130.3 689L1138.5 700L1130.3 711L1122 700Z", rotate: -20, cx: 1130.3, cy: 700, dense: true },
  { d: "M1177.5,717.6L1171,728.9L1158,728.9L1151.5,717.6L1158,706.4L1171,706.4Z", rotate: -39, cx: 1164.5, cy: 717.6 },
  { d: "M293.8 748.1l3.5 -9l3.5 9l3.5 -9l3.5 9l3.5 -9l3.5 9", rotate: -28, cx: 304.3, cy: 743.6 },
  { d: "M618.4 774.3a8.3 8.3 0 0 1 16.6 0M621.7 774.3a5 5 0 0 1 10 0", rotate: -27, cx: 626.7, cy: 774.3 },
  { d: "M672.8 754.6l3.2 -8.3l3.2 8.3l3.2 -8.3l3.2 8.3l3.2 -8.3l3.2 8.3", rotate: 31, cx: 682.5, cy: 750.5 },
  { d: "M710.4 742.8L718.1 753L710.4 763.2L702.7 753Z", rotate: 4, cx: 710.4, cy: 753, dense: true },
  { d: "M805.6 774.5l3.6 -9.3l3.6 9.3l3.6 -9.3l3.6 9.3l3.6 -9.3l3.6 9.3l3.6 -9.3l3.6 9.3", rotate: 15, cx: 820, cy: 769.8, dense: true },
  { d: "M874.9,746.1L868,758.2L854,758.2L847.1,746.1L854,734.1L868,734.1Z", rotate: -39, cx: 861, cy: 746.1 },
  { d: "M936.4,757.1L932,764.7L923.3,764.7L919,757.1L923.3,749.6L932,749.6Z", rotate: 27, cx: 927.7, cy: 757.1 },
  { d: "M978.5 758.6h20M978.5 764.8h20M978.5 771.1h20", rotate: 25, cx: 988.5, cy: 764.8, dense: true },
  { d: "M1039.6 757.3h14.6M1039.6 761.8h14.6M1039.6 766.4h14.6", rotate: -38, cx: 1046.9, cy: 761.8 },
  { d: "M1080.5 739h14.4M1080.5 743.5h14.4M1080.5 748h14.4", rotate: -3, cx: 1087.7, cy: 743.5 },
  { d: "M1150.8,752.3L1146.4,759.9L1137.6,759.9L1133.3,752.3L1137.6,744.7L1146.4,744.7Z", rotate: -11, cx: 1142, cy: 752.3 },
  { d: "M1196.6,760.5L1191.4,769.4L1181.1,769.4L1175.9,760.5L1181.1,751.5L1191.4,751.5Z", rotate: 36, cx: 1186.3, cy: 760.5, dense: true },
  { d: "M1069 355.2a2.2 2.2 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M105.7 370.1a3.6 3.6 0 1 0 0.1 0", fill: true },
  { d: "M781.5 56.7a3.2 3.2 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M444.7 345a3.1 3.1 0 1 0 0.1 0", fill: true },
  { d: "M1114.7 757.3a3.2 3.2 0 1 0 0.1 0", fill: true },
  { d: "M370.4 563a3.3 3.3 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M282.4 102.8a3.1 3.1 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M805 367.3a2.3 2.3 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M644 326.5a3.1 3.1 0 1 0 0.1 0", fill: true },
  { d: "M1091.7 430.5a3.1 3.1 0 1 0 0.1 0", fill: true },
  { d: "M1152.9 244.4a3.1 3.1 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M176.7 465.5a2.9 2.9 0 1 0 0.1 0", fill: true },
  { d: "M1104 67.5a3.7 3.7 0 1 0 0.1 0", fill: true },
  { d: "M1072.2 563.2a2.5 2.5 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M288.6 163.7a3.4 3.4 0 1 0 0.1 0", fill: true },
  { d: "M1027.5 528.7a2.8 2.8 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M126.4 84.4a3.3 3.3 0 1 0 0.1 0", fill: true },
  { d: "M56.1 703.6a3 3 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M541.8 280.5a2.7 2.7 0 1 0 0.1 0", fill: true },
  { d: "M349.9 193a3.7 3.7 0 1 0 0.1 0", fill: true },
  { d: "M783.8 149a2.7 2.7 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M78.6 222.8a2.6 2.6 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M313.3 709a3.1 3.1 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M714.8 180.7a2.6 2.6 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M635.5 463a2.3 2.3 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M952.7 677.6a3.8 3.8 0 1 0 0.1 0", fill: true },
  { d: "M229.2 98.9a3.4 3.4 0 1 0 0.1 0", fill: true },
  { d: "M1144.4 592.3a2.5 2.5 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M435.7 640.1a3 3 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M389.9 391.4a2.7 2.7 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M680.5 410.5a3.4 3.4 0 1 0 0.1 0", fill: true },
  { d: "M1053 392.5a2.8 2.8 0 1 0 0.1 0", fill: true },
  { d: "M552.8 536.2a2.4 2.4 0 1 0 0.1 0", fill: true },
  { d: "M420.8 331.2a3 3 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M180.1 553.7a2.3 2.3 0 1 0 0.1 0", fill: true },
  { d: "M344.9 66a3.2 3.2 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M924.5 708.9a2.9 2.9 0 1 0 0.1 0", fill: true },
  { d: "M995 641a3.1 3.1 0 1 0 0.1 0", fill: true },
  { d: "M71.5 467.5a3.3 3.3 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M897.6 442.3a3.7 3.7 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M361.7 485.5a2.9 2.9 0 1 0 0.1 0", fill: true },
  { d: "M340.4 269.2a2.5 2.5 0 1 0 0.1 0", fill: true },
  { d: "M227.9 722a3.5 3.5 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M507.2 70.8a3.5 3.5 0 1 0 0.1 0", fill: true },
  { d: "M82.1 485.5a3.2 3.2 0 1 0 0.1 0", fill: true },
  { d: "M548 471.5a3.1 3.1 0 1 0 0.1 0", fill: true },
  { d: "M321.2 74.7a2.3 2.3 0 1 0 0.1 0", fill: true },
  { d: "M528.1 559a3.2 3.2 0 1 0 0.1 0", fill: true },
  { d: "M847.8 155.6a3.2 3.2 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M367.5 367.7a3.4 3.4 0 1 0 0.1 0", fill: true },
  { d: "M1056.7 528.7a2.5 2.5 0 1 0 0.1 0", fill: true },
  { d: "M851.1 656.3a2.2 2.2 0 1 0 0.1 0", fill: true },
  { d: "M614.9 244.2a2.9 2.9 0 1 0 0.1 0", fill: true },
  { d: "M88.2 564.7a2.3 2.3 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M237.1 188.5a2.5 2.5 0 1 0 0.1 0", fill: true },
  { d: "M663 45.5a2.4 2.4 0 1 0 0.1 0", fill: true },
  { d: "M93.8 102.6a2.4 2.4 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M1082.2 68.3a3.2 3.2 0 1 0 0.1 0", fill: true },
  { d: "M519.5 192a3.8 3.8 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M67.6 304.5a3.7 3.7 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M513.9 373.4a2.4 2.4 0 1 0 0.1 0", fill: true },
  { d: "M892.9 176.3a3.8 3.8 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M381.9 188.3a3.5 3.5 0 1 0 0.1 0", fill: true },
  { d: "M310.1 29a2.4 2.4 0 1 0 0.1 0", fill: true },
  { d: "M39 382.2a3.1 3.1 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M62 207.1a2.8 2.8 0 1 0 0.1 0", fill: true },
  { d: "M215.3 756a2.7 2.7 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M585.4 502.2a2.5 2.5 0 1 0 0.1 0", fill: true, dense: true },
  { d: "M515.7 36.9a2.5 2.5 0 1 0 0.1 0", fill: true },
  { d: "M685.8 687.9a2.5 2.5 0 1 0 0.1 0", fill: true, dense: true },
];

export function HeroPattern() {
  return (
    <div
      aria-hidden
      // Above the hero's media layer, which fills the frame even when no
      // media file exists — beneath it the marks were covered and nothing
      // reached the screen. The hero's content sits at z-10 above both.
      //
      // pointer-events off so it can never intercept a click on the type.
      className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
      style={{
        // Fades out over the bottom third, so the marks never run into the
        // image row that follows the hero.
        maskImage:
          "linear-gradient(to bottom, #000 0%, #000 58%, transparent 92%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 0%, #000 58%, transparent 92%)",
      }}
    >
      <svg
        viewBox="0 0 1200 800"
        // Stretched to the element rather than cropped to it. `slice` scales
        // the box to cover and pushed most of the marks off-frame; these are
        // abstract shapes, so the mild distortion is invisible where losing
        // two thirds of the pattern was not.
        preserveAspectRatio="none"
        className="hive-hero-pattern size-full"
        role="presentation"
      >
        <title>Decorative background pattern</title>
        <g
          fill="none"
          stroke="var(--hero-mark)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {MARKS.map((mark) => (
            <path
              key={mark.d}
              d={mark.d}
              className={mark.dense ? "hive-hero-dense" : undefined}
              fill={mark.fill ? "var(--hero-mark)" : "none"}
              stroke={mark.fill ? "none" : undefined}
              // The accent marks are the only variation in weight, and they
              // are still far below anything that could read as artwork.
              opacity={mark.accent ? 1 : 0.72}
              transform={
                mark.rotate && mark.cx != null && mark.cy != null
                  ? `rotate(${mark.rotate} ${mark.cx} ${mark.cy})`
                  : undefined
              }
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
