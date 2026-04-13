import {
  ADDON_CATEGORY,
  ADDON_TYPE,
  PLUGIN_TYPE,
  PROPERTY_TYPE,
} from "./template/enums.js";
import _version from "./version.js";
export const addonType = ADDON_TYPE.BEHAVIOR;
export const type = PLUGIN_TYPE.OBJECT;
export const id = "salmanshh_statforge";
export const name = "StatForge";
export const version = _version;
export const minConstructVersion = undefined;
export const author = "SalmanShh";
export const website = "https://www.construct.net";
export const documentation = "https://www.construct.net";
export const description = "A layered buff and debuff system. Attach to any object to give it named stats that can be boosted, reduced, timed, or chained together using a stack of modifiers.";
export const category = ADDON_CATEGORY.ATTRIBUTES;

export const hasDomside = false;
export const files = {
  extensionScript: {
    enabled: false, // set to false to disable the extension script
    watch: true, // set to true to enable live reload on changes during development
    targets: ["x86", "x64"],
    // you don't need to change this, the build step will rename the dll for you. Only change this if you change the name of the dll exported by Visual Studio
    name: "MyExtension",
  },
  fileDependencies: [],
  remoteFileDependencies: [
    // {
    //   src: "https://example.com/api.js", // Must use https:// or same-protocol // URLs. http:// is not allowed.
    //   type: "" // Optional: "" or "module". Empty string or omit for classic script.
    // }
  ],
  cordovaPluginReferences: [],
  cordovaResourceFiles: [],
};

// categories that are not filled will use the folder name
export const aceCategories = {
  Buff_Management: "Buff Management",
  Source_Tracking: "Source Tracking",
  Tag_Control: "Tag Control",
  Activation_Control: "Activation",
  Timer_Control: "Timers",
  Stat_Base: "Stat Base",
  Buff_Links: "Buff Links",
  Stack_Thresholds: "Stack Thresholds",
  Events: "Events",
  State_Checks: "State Checks",
  Stat_Values: "Stat Values",
  Buff_Info: "Buff Info",
  Buff_Lists: "Buff Lists",
  Tag_Lists: "Tag Lists",
  Link_Rule_Counts: "Links & Rules",
  Event_Context: "Event Context",
};

export const info = {
  // icon: "icon.svg",
  // PLUGIN world only
  // defaultImageUrl: "default-image.png",
  Set: {
    // COMMON to all
    CanBeBundled: true,
    IsDeprecated: false,
    GooglePlayServicesEnabled: false,

    // BEHAVIOR only
    IsOnlyOneAllowed: false,

    // PLUGIN world only
    IsResizable: false,
    IsRotatable: false,
    Is3D: false,
    HasImage: false,
    IsTiled: false,
    SupportsZElevation: false,
    SupportsColor: false,
    SupportsEffects: false,
    MustPreDraw: false,

    // PLUGIN object only
    IsSingleGlobal: false,
  },
  // PLUGIN only
  AddCommonACEs: {
    Position: false,
    SceneGraph: false,
    Size: false,
    Angle: false,
    Appearance: false,
    ZOrder: false,
  },
};

export const properties = [
  // Index 0: autoTickTimers
  {
    type: PROPERTY_TYPE.CHECK,
    id: "autoTickTimers",
    name: "Auto-tick timers",
    desc: "Automatically counts down temporary buff timers every frame. Disable if you want to advance timers manually.",
    options: { initialValue: true },
  },
  // Index 1: overflowMode
  {
    type: PROPERTY_TYPE.COMBO,
    id: "overflowMode",
    name: "Overflow mode",
    desc: "What happens when a stat total goes outside the Min/Max range. Clamp = stop at the boundary. Wrap = loop around. None = no limit.",
    options: {
      initialValue: "clamp",
      items: [
        { clamp: "Clamp" },
        { wrap: "Wrap" },
        { none: "None" },
      ],
    },
  },
  // Index 2: minValue
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "minValue",
    name: "Min value",
    desc: "The lowest a stat total can go when Overflow mode is Clamp or Wrap.",
    options: { initialValue: -99999 },
  },
  // Index 3: maxValue
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "maxValue",
    name: "Max value",
    desc: "The highest a stat total can go when Overflow mode is Clamp or Wrap.",
    options: { initialValue: 99999 },
  },
  // Index 4: debugMode
  {
    type: PROPERTY_TYPE.CHECK,
    id: "debugMode",
    name: "Debug mode",
    desc: "Logs every buff change, link fire, and threshold trigger to the browser console. Turn off before releasing.",
    options: { initialValue: false },
  },
];
