import Logger from "utils/Logger";
import UUID from "utils/UUID";
import ObjectUtils from "utils/ObjectUtils";
import GridLayoutGenerator from "service/setup/GridLayoutGenerator";

const logger = Logger.getLogger("ConfigExtender");


export default class ConfigExtender {

  /**
   * Extends dashboard configuration.
   *
   * If no grid layout is set, generate a default one.
   * If no thresholds is set, generate an empty one. Same for avatars.
   *
   * If a widget doesn't override avatars configuration, the avatars configuration is taken from
   * the global scope. Same for thresholds.
   *
   * If a widget is not linked to any dataSources, property can be not set in configuration but
   * we then prefer to map it on an empty array.
   *
   * Generate a unique widget key (required for react-grid-layout)
   * Each Widget has an id equals to its key.
   */
  static extendsConfig(dashboardConfig) {
    if (dashboardConfig.thresholds == null) {
      dashboardConfig.thresholds = {};
    }
    if (dashboardConfig.avatars == null) {
      dashboardConfig.avatars = {};
    }
    dashboardConfig.widgets.forEach(widgetConfig => {
      if (widgetConfig.avatars == null) {
        widgetConfig.avatars = dashboardConfig.avatars;
      }
      if (widgetConfig.thresholds == null) {
        widgetConfig.thresholds = dashboardConfig.thresholds;
      }
      if (widgetConfig.dataSource == null) {
        widgetConfig.dataSource = [];
      }
      if (widgetConfig.className == null) {
        widgetConfig.className = widgetConfig.type.toLowerCase().replace("widget", "");
      }
      widgetConfig.key = widgetConfig.id = UUID.random();
    });
    if (ObjectUtils.isNullOrEmpty(dashboardConfig.grid.layouts)) {
      dashboardConfig.grid.layouts = GridLayoutGenerator.generate(dashboardConfig);
      logger.info("Use auto-generated grid layout configuration");
    } else {
      logger.info("Use user grid layout configuration");
    }
  }

}
