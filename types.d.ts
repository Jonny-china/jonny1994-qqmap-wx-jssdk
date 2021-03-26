interface CommonResult {
  /**
   * 状态码，0为正常,
   *
   * 310请求参数信息有误，
   *
   * 311Key格式错误,
   *
   * 306请求有护持信息请检查字符串,
   *
   * 110请求来源未被授权
   *
   * 1000 小程序内部抛出的错误
   */
  status: number;

  /**
   * 状态说明，即对状态码status进行说明，
   *
   * @description
   * 如：
   *
   * status为0,message为"query ok",为正常,
   *
   * status为310,message为"请求参数信息有误",
   *
   * status为311,message为"key格式错误",
   *
   * status为306,message为"请求有护持信息请检查字符串",
   *
   * status为110,message为"请求来源未被授权"
   */
  message: string;
}

/**
 * 通用 options
 */
interface CommonOptions {
  fail?(res: CommonResult): void;
  complete?(res: CommonResult): void;

  /**
   * 签名校验
   *
   * 开启WebServiceAPI签名校验的必传参数，只需要传入生成的SK字符串即可，不需要进行MD5加密操作
   */
  sig?: string;
}

type Location = string | { latitude: string; longitude: string };

export interface ResultLocation {
  /**
   * 纬度
   */
  lat: number;

  /**
   * 经度
   */
  lng: number;
}

/**
 * POI周边检索 success result
 */
export interface SearchSuccessResult extends CommonResult {
  /**
   * 本次搜索结果总数
   */
  count: number;

  /**
   * 搜索结果POI数组，每项为一个POI对象
   */
  data: {
    /**
     * POI唯一标识
     */
    id: string;
    /**
     * POI名称
     */
    title: string;
    /**
     * 地址
     */
    address: string;
    /**
     * 电话
     */
    tel: string;
    /**
     * POI分类
     */
    category: string;
    /**
     * POI类型，值说明：0:普通POI / 1:公交车站 / 2:地铁站 / 3:公交线路 / 4:行政区划
     */
    type: string;
    /**
     * 坐标
     */
    location: ResultLocation;
    /**
     * 行政区划信息，目前仅提供adcode
     */
    ad_info: {
      /**
       * 行政区划代码
       */
      adcode: string;
    };

    /**
     * 轮廓，坐标数组，面积较大的POI会有，如住宅小区
     */
    boundary?: any[];

    /**
     * 该POI的街景最佳查看场景及视角信息
     */
    pano?: {
      /**
       * 街景场景ID，若有pano信息，则id一定存在
       */
      id: string;
      /**
       * 最佳偏航角（与正北方向夹角，街景相关知识请 https://lbs.qq.com/webApi/javascriptV2/jsGuide/jsStreetview）
       */
      heading: number;
      /**
       * 俯仰角
       */
      pitch: number;
      /**
       * 缩放级别
       */
      zoom: number;
    };
  }[];
}

/**
 * POI周边检索 options
 */
export interface SearchOptions extends CommonOptions {
  /**
   * POI搜索关键字
   *
   *（默认周边搜索，若需要使用指定地区名称和矩形搜索，请使用`region`和`rectangle`参数，不能同时使用）
   */
  keyword: string;
  /**
   * 位置坐标，
   *
   * ①String格式：lat<纬度>,lng<经度>（例：location: ‘39.984060,116.307520’）
   *
   * ②Object格式：
   * {
   *   latitude: 纬度,
   *   longitude: 经度
   * }
   * @example
   * location: {
   *   latitude: 39.984060,
   *   longitude: 116.307520
   * }
   * 默认是当前位置
   */
  location?: Location;

  /**
   * 短地址，缺省时返回长地址，可选值：`short`
   */
  address_format?: string;
  /**
   * 每页条目数，最大限制为20条，默认值10
   */
  page_size?: number;
  /**
   * 第x页，默认第1页
   */
  page_index?: number;

  /**
   * 指定地区名称，不自动扩大范围，如北京市,（使用该功能，若涉及到行政区划，建议将auto_extend设置为0）
   *
   * 当用户使用泛关键词搜索时（如酒店、超市），这类搜索多为了查找附近， 使用location参数，搜索结果以location坐标为中心，返回就近地点，体验更优(默认为用户当前位置坐标)
   * 不与rectangle同时使用
   */
  region?: string;

  /**
   * 矩形区域范围，不与region同时使用
   *
   * 格式：lat,lng<左下/西南>, lat,lng<右上/东北>(示例：rectangle:‘40.984061,116.307520,39.984060,116.507520’)
   */
  rectangle?: string;

  /**
   * 取值1：[默认]自动扩大范围；
   *
   * 取值0：不扩大。 仅适用于默认周边搜索以及制定地区名称搜索。
   */
  auto_extend?: string;
  /**
   * 最多支持五个分类
   *
   * **搜索指定分类**
   *
   * category=公交站
   *
   * **搜索多个分类**
   *
   * category=大学,中学
   *
   * **排除指定分类**
   *
   * category<>商务楼宇
   *
   * *（注意参数值要进行url编码）*
   */
  filter?: string;

  /**
   * 接口调用成功
   * @param res 调用结果
   * @param data 返回处理后的数据（非必须参数）
   * @example
   * success:function(res,data)
   */
  success?(res: SearchSuccessResult, data: any): void;
}

/**
 * sug模糊检索 success result
 */
export interface GetSuggestionSuccessResult extends CommonResult {
  /**
   * 本次搜索结果总数
   */
  count: number;

  /**
   * 搜索结果POI数组，每项为一个POI对象
   */
  data: {
    /**
     * POI唯一标识
     */
    id: string;
    /**
     * POI名称
     */
    title: string;
    /**
     * 地址
     */
    address: string;
    /**
     * 省
     */
    province: string;
    /**
     * 市
     */
    city: string;
    /**
     * POI类型，值说明：0:普通POI / 1:公交车站 / 2:地铁站 / 3:公交线路 / 4:行政区划
     */
    type: number;
    /**
     * 坐标
     */
    location: ResultLocation;
    /**
     * 行政区划代码
     */
    adcode: string;
  }[];
}

/**
 * sug模糊检索
 */
export interface GetSuggestionOptions extends CommonOptions {
  /**
   * 用户输入的关键词（希望获取后续提示的关键词）
   */
  keyword: string;
  /**
   * 设置城市名，限制关键词所示的地域范围，如，仅获取“广州市”范围内的提示内容,默认值全国
   */
  region?: string;
  /**
   * 取值： 0：[默认]当前城市无结果时，自动扩大范围到全国匹配 1：固定在当前城市
   */
  region_fix?: number;
  /**
   * 检索策略，目前支持：
   *
   * policy=0：默认，常规策略
   *
   * policy=1：本策略主要用于收货地址、上门服务地址的填写，提高了小区类、商务楼宇、大学等分类的排序，过滤行政区、道路等分类（如海淀大街、朝阳区等），排序策略引入真实用户对输入提示的点击热度，使之更为符合此类应用场景，体验更为舒适
   */
  policy?: number;
  /**
   * 定位坐标，传入后，若用户搜索关键词为类别词（如酒店、餐馆时），与此坐标距离近的地点将靠前显示，格式： location=lat,lng
   * @example
   * location: '39.11457,116.55332'
   */
  location?: string;

  /**
   * 是否返回子地点，如大厦停车场、出入口等取值：
   *
   * 0 [默认]不返回
   *
   * 1 返回
   */
  get_subpois?: number;

  /**
   * 最多支持五个分类
   *
   * **搜索指定分类**
   *
   * category=公交站
   *
   * **搜索多个分类**
   *
   * category=大学,中学
   *
   * *（注意参数值要进行url编码）*
   */
  filter?: string;
  /**
   * 短地址，缺省时返回长地址，可选值：`short`
   */
  address_format?: "short";
  /**
   * 每页条目数，最大限制为20条，默认值10
   */
  page_size?: number;
  /**
   * 第x页，默认第1页
   */
  page_index?: number;

  /**
   * 接口调用成功
   * @param res 调用结果
   * @param data 返回处理后的数据（非必须参数）
   * @example
   * success:function(res,data)
   */
  success?(res: SearchSuccessResult, data: any): void;
}

/**
 * 逆地址解析 success result
 */
export interface ReverseGeocoderSuccessResult extends CommonResult {
  /**
   * 逆地址解析结果
   */
  result: {
    /**
     * 地址描述
     */
    address: string;

    /**
     * 位置描述
     */
    formatted_addresses?: {
      /**
       * 经过腾讯地图优化过的描述方式，更具人性化特点
       */
      recommend?: string;
      /**
       * 大致位置，可用于对位置的粗略描述
       */
      rough?: string;
    };

    /**
     * 地址部件，address不满足需求时可自行拼接
     */
    address_component: {
      /**
       * 国家
       */
      nation: string;
      /**
       * 省
       */
      province: string;
      /**
       * 市
       */
      city: string;
      /**
       * 区，可能为空字串
       */
      district?: string;
      /**
       * 街道，可能为空字串
       */
      street?: string;
      /**
       * 门牌，可能为空字串
       */
      street_number?: string;
    };

    /**
     * 地址信息
     */
    ad_info: {
      /**
       * 行政区划代码
       */
      adcode: string;
      /**
       * 行政区划名称
       */
      name: string;
      /**
       * 行政区划中心点坐标
       */
      location: ResultLocation;
      /**
       * 国家
       */
      nation: string;
      /**
       * 省 / 直辖市
       */
      province: string;
      /**
       * 市 / 地级区 及同级行政区划
       */
      city: string;
      /**
       * 区 / 县级市 及同级行政区划
       */
      district?: string;
    };

    /**
     * 坐标相对位置参考
     */
    address_reference?: {
      /**
       * 知名区域，如商圈或人们普遍认为有较高知名度的区域
       */
      famous_area?: {
        /**
         * 名称/标题
         */
        title?: string;

        /**
         * 坐标
         */
        location?: ResultLocation;
        /**
         * 此参考位置到输入坐标的直线距离
         */
        _distance?: number;
        /**
         * 此参考位置到输入坐标的方位关系，如：北、南、内
         */
        _dir_desc?: string;
      };

      /**
       * 乡镇街道
       */
      town?: ReverseGeocoderSuccessResult["result"]["address_reference"]["famous_area"];
      /**
       * 一级地标，可识别性较强、规模较大的地点、小区等
       */
      landmark_l1?: ReverseGeocoderSuccessResult["result"]["address_reference"]["famous_area"];
      /**
       * 二级地标，较一级地标更为精确，规模更小
       */
      landmark_l2?: ReverseGeocoderSuccessResult["result"]["address_reference"]["famous_area"];
      /**
       * 街道
       */
      street?: ReverseGeocoderSuccessResult["result"]["address_reference"]["famous_area"];
      /**
       * 门牌
       */
      street_number?: ReverseGeocoderSuccessResult["result"]["address_reference"]["famous_area"];
      /**
       * 交叉路口
       */
      crossroad?: ReverseGeocoderSuccessResult["result"]["address_reference"]["famous_area"];
      /**
       * 水系
       */
      water?: ReverseGeocoderSuccessResult["result"]["address_reference"]["famous_area"];
    };
  };
  /**
   * POI数组，对象中每个子项为一个POI对象，返回的POI数量及页数可通过请求参数poi_options设置
   */
  pois?: {
    /**
     * POI唯一标识
     */
    id?: string;
    /**
     * POI名称
     */
    title?: string;
    /**
     * 地址
     */
    address?: string;
    /**
     * POI分类
     */
    category?: string;
    /**
     * 坐标
     */
    location?: ResultLocation;
    /**
     * 该POI到逆地址解析传入的坐标的直线距离
     */
    _distance?: number;
  }[];
}

/**
 * 逆地址解析 options
 */
export interface ReverseGeocoderOptions extends CommonOptions {
  /**
   * 位置坐标，
   *
   * ①String格式：lat<纬度>,lng<经度>（例：location: ‘39.984060,116.307520’）
   *
   * ②Object格式：
   * {
   *   latitude: 纬度,
   *   longitude: 经度
   * }
   * @example
   * location: {
   *   latitude: 39.984060,
   *   longitude: 116.307520
   * }
   * 默认是当前位置
   */
  location?: Location;
  /**
   * 输入的locations的坐标类型，可选值为[1,6]之间的整数，每个数字代表的类型说明：
   *
   * 1 GPS坐标
   *
   * 2 sogou经纬度
   *
   * 3 baidu经纬度
   *
   * 4 mapbar经纬度
   *
   * 5 [默认]腾讯、google、高德坐标
   *
   * 6 sogou墨卡托
   */
  coord_type?: number;

  /**
   * 是否返回周边POI列表：
   *
   * 1.返回；0不返回(默认)
   */
  get_poi?: number;

  /**
   * 用于控制Poi列表：
   *
   * - 1 poi_options=address_format=short
   *
   *   返回短地址，缺省时返回长地址
   *
   *
   * - 2 poi_options=radius=5000
   *
   *   半径，取值范围 1-5000（米）
   *
   *
   * - 3 poi_options=page_size=20
   *
   *   每页条数，取值范围 1-20
   *
   *
   * - 4 poi_options=page_index=1
   *
   *   页码，取值范围 1-20
   *
   *
   * - 5 poi_options=policy=1/2/3
   *
   *   控制返回场景，
   *
   *   policy=1[默认] 以地标+主要的路+近距离poi为主，着力描述当前位置；
   *
   *   policy=2 到家场景：筛选合适收货的poi，并会细化收货地址，精确到楼栋；
   *
   *   policy=3 出行场景：过滤掉车辆不易到达的POI(如一些景区内POI)，增加道路出路口、交叉口、大区域出入口类POI，排序会根据真实API大用户的用户点击自动优化。
   *
   *
   * - 6 poi_options=category=分类词1,分类词2，
   *
   *   指定分类，多关键词英文逗号分隔；
   *
   *   poi_filter=category<>分类词1,分类词2，
   *
   *   指定不包含分类，多关键词英文逗号分隔
   *
   *   （支持类别参见：https://lbs.qq.com/service/webService/webServiceGuide/webServiceAppendix）
   */
  poi_options?: string;

  /**
   * 接口调用成功
   * @param res 调用结果
   * @param data 返回处理后的数据（非必须参数）
   * @example
   * success:function(res,data)
   */
  success?(res: ReverseGeocoderSuccessResult, data: any): void;
}

/**
 * 地址解析 success result
 */
export interface GeocoderSuccessResult extends CommonResult {
  /**
   * 地址解析结果
   */
  result: {
    /**
     * 解析到的坐标
     */
    location: ResultLocation;

    /**
     * 解析后的地址部件
     */
    address_components: Omit<
      ReverseGeocoderSuccessResult["result"]["address_component"],
      "nation"
    >;

    /**
     * 查询字符串与查询结果的文本相似度
     */
    similarity: number;
    /**
     * 误差距离，单位：米， 该值取决于输入地址的精确度；
     *
     * 如address输入：海淀区北四环西路，因为地址所述范围比较大，因此会有千米级误差；
     *
     * 而如：银科大厦这类具体的地址，返回的坐标就会相对精确；
     *
     * 该值为 -1 时，说明输入地址为过于模糊，仅能精确到市区级。
     */
    deviation: number;
    /**
     * 可信度参考：值范围 1 低可信 - 10 高可信
     * 我们根据用户输入地址的准确程度，在解析过程中，将解析结果的可信度(质量)，由低到高，分为1 - 10级，该值>=7时，解析结果较为准确，<7时，会存各类不可靠因素，开发者可根据自己的实际使用场景，对于解析质量的实际要求，进行参考。
     */
    reliability: number;
  };
}

/**
 * 地址解析 options
 */
export interface GeocoderOptions extends CommonOptions {
  /**
   * 地址（注：地址中请包含城市名称，否则会影响解析效果），如：`北京市海淀区彩和坊路海淀西大街74号`
   */
  address?: string;
  /**
   * 指定地址所属城市,如北京市
   *
   */
  region?: string;

  /**
   * 接口调用成功
   * @param res 调用结果
   * @param data 返回处理后的数据（非必须参数）
   * @example
   * success:function(res,data)
   */
  success?(res: GeocoderSuccessResult, data: any): void;
}

/**
 * 路线规划 mode 参数可选值
 */
export type DirectionMode = "driving" | "walking" | "bicycling" | "transit";

/**
 * 路线规划 options
 */
export interface DirectionOptions extends CommonOptions {
  /**
   * 路线规划选择，可选值：
   *
   * `driving`（驾车）
   *
   * `walking`（步行）
   *
   * `bicycling`（骑行）
   *
   * `transit`（公交）
   *
   * 默认：`driving`
   */
  mode?: DirectionMode;

  /**
   * 位置坐标，
   *
   * ①String格式：lat<纬度>,lng<经度>（例：from: ‘39.984060,116.307520’）
   *
   * ②Object格式：
   * {
   *   latitude: 纬度,
   *   longitude: 经度
   * }
   * @example
   * from: {
   *   latitude: 39.984060,
   *   longitude: 116.307520
   * }
   * 默认是当前位置
   */
  from: Location;

  /**
   * 位置坐标，
   *
   * ①String格式：lat<纬度>,lng<经度>（例：to: ‘39.984060,116.307520’）
   *
   * ②Object格式：
   * {
   *   latitude: 纬度,
   *   longitude: 经度
   * }
   * @example
   * to: {
   *   latitude: 39.984060,
   *   longitude: 116.307520
   * }
   * 默认是当前位置
   */
  to: Location;
}

/**
 * 驾车路线规划 路线方案
 */
export interface DirectionDrivingRoutes {
  /**
   * 方案交通方式，固定值：“DRIVING”
   */
  mode: "DRIVING";

  /**
   * 方案标签，用于表明方案特点
   *
   * 示例：tags:[“LEAST_LIGHT”]
   *
   * 取值：
   * EXPERIENCE 经验路线
   *
   * RECOMMEND 推荐路线
   *
   * LEAST_LIGHT 红绿灯少
   *
   * LEAST_TIME 时间最短
   *
   * LEAST_DISTANCE 距离最短
   */
  tags?: string[];
  /**
   * 方案总距离
   */
  distance: number;
  /**
   * 方案估算时间（含路况）
   */
  duration: number;
  /**
   * 限行信息
   */
  restriction?: {
    /**
     * 限行状态码：
     *
     * 0 途经没有限行城市，或路线方案未涉及限行区域
     *
     * 1 途经包含有限行的城市
     *
     * 3 [设置车牌] 已避让限行
     *
     * 4 [设置车牌] 无法避开限行区域（本方案包含限行路段）
     */
    status: number;
  };
  /**
   * 方案路线坐标点串（该点串经过压缩，解压请参考：https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodDirection#4
   */
  polyline: number[];

  /**
   * 途经点，顺序与输入waypoints一致 （输入waypoints时才会有此结点返回）
   */
  waypoints?: {
    /**
     * 途经点路名
     */
    title?: string;
    /**
     * 途经点坐标
     */
    location?: ResultLocation;
  }[];
  /**
   * 预估打车费
   */
  taxi_fare?: {
    /**
     * 预估打车费用，单位：元
     */
    fare?: number;
  };

  /**
   * 路线步骤
   */
  steps: {
    /**
     * 阶段路线描述
     */
    instruction: string;
    /**
     * 阶段路线坐标点串在方案路线坐标点串的位置
     */
    polyline_idx: number[];
    /**
     * 阶段路线路名
     */
    road_name?: string;
    /**
     * 阶段路线方向
     */
    dir_desc?: string;
    /**
     * 阶段路线距离
     */
    distance: number;
    /**
     * 阶段路线末尾动作：如：左转调头
     */
    act_desc?: string;
    /**
     * 末尾辅助动作：如：到达终点
     */
    accessorial_desc?: string;
  }[];
}

/**
 * 驾车 规划路线 success result
 */
export interface DirectionDrivingSuccessResult extends CommonResult {
  result: {
    /**
     * 路线方案
     */
    routes: DirectionDrivingRoutes[];
  };
}

/**
 * 路线规划 mode=driving  options
 */
export interface DirectionDrivingOptions extends DirectionOptions {
  mode: "driving";

  /**
   * 起点POI ID，传入后，优先级高于from（坐标）
   * @example
   * from_poi:4077524088693206111
   */
  from_poi?: number;
  /**
   * [from辅助参数]在起点位置时的车头方向，数值型，取值范围0至360（0度代表正北，顺时针一周360度）
   *
   * 传入车头方向，对于车辆所在道路的判断非常重要，直接影响路线计算的效果
   *
   * @example
   *heading:175
   */
  heading?: number;

  /**
   * [from辅助参数]速度，单位：米/秒，默认3。 当速度低于1.39米/秒时，heading将被忽略
   *
   * @example
   * speed:5
   */
  speed?: number;
  /**
   * [from辅助参数]定位精度，单位：米，取>0数值，默认5。 当定位精度>30米时heading参数将被忽略
   *
   * @example
   * accuracy:30
   */
  accuracy?: number;
  /**
   * [from辅助参数] 起点道路类型，可选值：
   *
   * 0 [默认]不考虑起点道路类型
   *
   * 1 在桥上；2 在桥下；3 在主路；4 在辅路；5 在对面；6 桥下主路；7 桥下辅路
   */
  road_type?: number;
  /**
   * 起点轨迹：
   *
   * 在真实的场景中，易受各种环境及设备精度影响，导致定位点产生误差，传入起点前段轨迹，可有效提升准确度。
   *
   * 优先级： 高于from参数
   *
   * 轨迹中的每个定位点包含以下信息：
   * 1. 纬度
   * 2. 经度
   * 3. 速度：GPS速度，单位 米/秒，取不到传-1
   * 4. 精度：GPS精度, 单位毫米，取不到传-1
   * 5. 运动方向： gps方向，正北为0, 顺时针夹角，[0-360)，获取不到时传-1
   * 6. 设备方向：正北为0, 顺时针夹角，[0-360)，取不到传-1
   * 7. 时间：定位获取该点的时间，Unix时间戳，取不到传0
   * 参数格式：
   * 1. 轨迹中最多支持传入50个点。
   * 2. 每个点之间英文分号分隔，时间顺序由旧到新（第一个点最早获取，最后一个点最新得到）
   * 3. 每个点中的信息用英文逗号分隔，并按以下顺序传入：
   * 纬度,经度,速度,精度,运动方向,设备方向,时间;第2个点;第2个点……
   */
  from_track?: string;
  /**
   * 终点POI ID（可通过腾讯位置服务地点搜索服务得到），当目的地为较大园区、小区时，会以引导点做为终点（如出入口等），体验更优。
   * 该参数优先级高于to（坐标），但是当目的地无引导点数据或POI ID失效时，仍会使用to（坐标）作为终点
   *
   * @example
   * to_poi:5371594408805356897
   */
  to_poi?: number;
  /**
   * 途经点，格式：lat1,lng1;lat2,lng2;… 最大支持10个
   *
   * @example
   * waypoints:39.951004,116.571980
   */
  waypoints?: string;
  /**
   * 一、策略参数（以下三选一）
   *
   * `LEAST_TIME`：[默认]参考实时路况，时间最短
   *
   * `PICKUP`：网约车场景 – 接乘客
   *
   * `TRIP`：网约车场景 – 送乘客
   *
   *
   * 二、单项偏好参数
   *
   * （可与策略参数并用，可多选，逗号分隔）
   *
   * `REAL_TRAFFIC`：参考实时路况
   *
   * `LEAST_FEE`：少收费
   *
   * `AVOID_HIGHWAY`：不走高速
   *
   * `NAV_POINT_FIRST`： 该策略会通过终点坐标查找所在地点（如小区/大厦等），并使用地点出入口做为目的地，使路径更为合理
   *
   * @example
   * `policy:'LEAST_TIME'` 或者 `policy:LEAST_TIME,AVOID_HIGHWAY`
   */
  policy?: string;
  /**
   * 车牌号，填入后，路线引擎会根据车牌对限行区域进行避让，不填则不不考虑限行问题
   *
   * @example
   * plate_number:京X309KX
   */
  plate_number?: string;

  /**
   * 接口调用成功
   * @param res 调用结果
   * @param data 返回处理后的数据（非必须参数）
   * @example
   * success:function(res,data)
   */
  success?(res: DirectionDrivingSuccessResult, data: any): void;
}

/**
 * 步行路线规划 路线方案
 */
export interface DirectionWalkingRoutes {
  /**
   * 方案交通方式，固定值：“WALKING”
   */
  mode: "WALKING";
  /**
   * 方案整体距离（米）
   */
  distance: number;
  /**
   * 方案估算时间（分钟）
   */
  duration: number;
  /**
   * 方案整体方向
   */
  direction: string;
  /**
   * 方案路线坐标点串（该点串经过压缩，解压请参考：https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodDirection#4）
   */
  polyline: number[];
  /**
   * 路线步骤
   */
  steps: {
    /**
     * 阶段路线描述
     */
    instruction: string;
    /**
     * 阶段路线坐标点串在方案路线坐标点串的位置
     */
    polyline_idx: number[];
    /**
     * 阶段路线路名
     */
    road_name?: string;
    /**
     * 阶段路线方向
     */
    dir_desc?: string;
    /**
     * 阶段路线距离
     */
    distance: number;
    /**
     * 阶段路线末尾动作：如：左转调头
     */
    act_desc?: string;
  }[];
}

export interface DirectionWalkingSuccessResult extends CommonResult {
  result: {
    /**
     * 路线方案
     */
    routes: DirectionWalkingRoutes[];
  };
}

/**
 * 路线规划 步行 options
 */
export interface DirectionWalkingOptions extends DirectionOptions {
  mode: "walking";

  /**
   * 接口调用成功
   * @param res 调用结果
   * @param data 返回处理后的数据（非必须参数）
   * @example
   * success:function(res,data)
   */
  success?(res: DirectionWalkingSuccessResult, data: any): void;
}

/**
 * 步行路线规划 路线方案
 */
export interface DirectionBicyclingRoutes
  extends Omit<DirectionWalkingRoutes, "mode"> {
  /**
   * 方案交通方式，固定值：“BICYCLING”
   */
  mode: "BICYCLING";
}

export interface DirectionBicyclingSuccessResult extends CommonResult {
  result: {
    /**
     * 路线方案
     */
    routes: DirectionBicyclingRoutes[];
  };
}

/**
 * 路线规划 骑行 options
 */
export interface DirectionBicyclingOptions extends DirectionOptions {
  mode: "bicycling";
  /**
   * 接口调用成功
   * @param res 调用结果
   * @param data 返回处理后的数据（非必须参数）
   * @example
   * success:function(res,data)
   */
  success?(res: DirectionBicyclingSuccessResult, data: any): void;
}

/**
 * 路线规划 mode=transit  options
 */
export interface DirectionTransitOptions extends DirectionOptions {
  mode: "transit";

  departure_time?: number;

  /**
   * 1) 排序策略，以下三选一：
   * policy=LEAST_TIME：时间短（默认）
   *
   * policy=LEAST_TRANSFER：少换乘
   *
   * policy=LEAST_WALKING：少步行
   *
   * 2) 额外限制条件
   * （可与排序策略配合使用，如：policy=LEAST_TRANSFER,NO_SUBWAY）：
   * NO_SUBWAY ，不坐地铁
   *
   * @example
   * policy:‘LEAST_TIME’ 或者 policy:‘LEAST_TIME,AVOID_HIGHWAY’
   */
  policy?: string;

  success?(res: CommonResult, data: any): void;
}

/**
 * 获取全国城市列表数据 success result
 */
export interface GetCityListSuccessResult extends CommonResult {
  /**
   * 结果数组，第0项，代表一级行政区划，第1项代表二级行政区划，以此类推；使用getchildren接口时，仅为指定父级行政区划的子级
   */
  result: {
    /**
     * 行政区划唯一标识
     */
    id: number;
    /**
     * 简称，如“内蒙古”
     */
    name?: string;
    /**
     * 全称，如“内蒙古自治区”
     */
    fullname: string;
    /**
     * 中心点坐标
     */
    location: ResultLocation;
    /**
     * 行政区划拼音，每一下标为一个字的全拼，如：[“nei”,“meng”,“gu”]
     */
    pinyin: string[];
    /**
     * 子级行政区划在下级数组中的下标位置
     */
    cidx: any[];
  }[];
}

/**
 * 获取全国城市列表数据 options
 */
export interface GetCityListOptions extends CommonOptions {
  /**
   * 接口调用成功
   * @param res 调用结果
   * @param data 返回处理后的数据（非必须参数）
   * @example
   * success:function(res,data)
   */
  success?(res: GetCityListSuccessResult, data: any): void;
}

/**
 * 获取对应城市ID的区县列表 success result
 */
export interface GetDistrictByCityIdSuccessResult
  extends GetCityListSuccessResult {}

/**
 * 获取对应城市ID的区县列表 options
 */
export interface GetDistrictByCityIdOptions extends CommonOptions {
  /**
   * 对应接口getCityList返回数据的Id，如：北京是 `110000`
   */
  id: string;

  /**
   * 接口调用成功
   * @param res 调用结果
   * @param data 返回处理后的数据（非必须参数）
   * @example
   * success:function(res,data)
   */
  success?(res: GetDistrictByCityIdSuccessResult, data: any): void;
}

/**
 * 获取对应城市ID的区县列表 success result
 */
export interface CalculateDistanceSuccessResult extends CommonResult {
  /**
   * 计算结果
   */
  result: {
    /**
     * 结果数组
     */
    elements: {
      /**
       * 起点坐标
       */
      from: ResultLocation;
      /**
       * 终点坐标
       */
      to: ResultLocation;
      /**
       * 起点到终点的距离，单位：米，
       *
       * 如果radius半径过小或者无法搜索到，则返回-1
       */
      distance: number;
      /**
       * 表示从起点到终点的结合路况的时间，秒为单位
       *
       * 注：步行方式不计算耗时，该值始终为0
       */
      duration: number;
    }[];
  };
}

/**
 * 距离计算 mode 参数可选值
 */
export type CalculateDistanceMode = "driving" | "walking" | "straight";

/**
 * 距离计算 options
 */
export interface CalculateDistanceOptions extends CommonOptions {
  /**
   * 可选值：`driving`（驾车）、`walking`（步行），默认：`walking`
   * 新增直线距离计算，`straight`（直线）
   */
  mode?: CalculateDistanceMode;

  /**
   * 接口调用成功
   * @param res 调用结果
   * @param data 返回处理后的数据（非必须参数）
   * @example
   * success:function(res,data)
   */
  success?(res: CalculateDistanceSuccessResult, data: any): void;
}

export default class QQMapWX {
  /**
   * 构造函数
   *
   * @param {{key: string}} options 接口参数,key 为必选参数
   */
  constructor(options: { key: string });

  /**
   * POI周边检索
   *
   * @param {SearchOptions} options 接口参数对象
   *
   * 参数对象结构可以参考
   * https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodSearch
   */
  search(options: SearchOptions): void;

  /**
   * sug模糊检索
   *
   * 用于获取输入关键字的补完与提示，帮助用户快速输入
   *
   * @param {GetSuggestionOptions} options 接口参数对象
   *
   * 参数对象结构可以参考
   * https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodGetsuggestion
   */
  getSuggestion(options: GetSuggestionOptions): void;

  /**
   * 逆地址解析
   *
   * @param {ReverseGeocoderOptions} options 接口参数对象
   *
   * 请求参数结构可以参考
   * https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodReverseGeocoder
   */
  reverseGeocoder(options: ReverseGeocoderOptions): void;

  /**
   * 地址解析
   *
   * @param {Object} options 接口参数对象
   *
   * 请求参数结构可以参考
   * https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodGeocoder
   */
  geocoder(options: GeocoderOptions): void;

  /**
   * 获取城市列表
   *
   * @param {Object} options 接口参数对象
   *
   * 请求参数结构可以参考
   * https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodGetcitylist
   */
  getCityList(options: GetCityListOptions): void;

  /**
   * 获取对应城市ID的区县列表
   *
   * @param {Object} options 接口参数对象
   *
   * 请求参数结构可以参考
   * https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodGetdistrictbycityid
   */
  getDistrictByCityId(options: GetDistrictByCityIdOptions): void;

  /**
   * 用于单起点到多终点的路线距离(非直线距离)计算：
   * 支持两种距离计算方式：步行和驾车。
   * 起点到终点最大限制直线距离10公里。
   *
   * 新增直线距离计算。
   *
   * @param {Object} options 接口参数对象
   *
   * 请求参数结构可以参考
   * https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodCalculatedistance
   */
  calculateDistance(options: CalculateDistanceOptions): void;

  /**
   * 路线规划：
   *
   * 提供驾车，步行，骑行，公交的路线规划能力
   *
   * @param {Object} options 接口参数对象
   *
   * 请求参数结构可以参考
   * https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodDirection
   */
  direction(options: DirectionDrivingOptions): void;
  direction(options: DirectionWalkingOptions): void;
  direction(options: DirectionBicyclingOptions): void;
  direction(options: DirectionTransitOptions): void;
}
