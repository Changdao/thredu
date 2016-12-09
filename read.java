public static TCheckin checkin(Connection trConn,int hotelId,String empId, TCheckin checkin, List<TCheckinGuest> guests, List<TRoomprice> priceList,String empPhone) throws Exception {
        //CheckinObject checkinObject = new CheckinObject(hotelId, empId, tCheckin, guests, priceList, empPhone).invoke();
        List<TRoomStatus> updateRoomStatusList = new ArrayList<TRoomStatus>();

        //把前台自定义的房价，按照日期放置在一个map中
        HashMap<String, TRoomprice> priceMap = new HashMap<String, TRoomprice>();
        if (priceList != null) {
            for (TRoomprice tmpPrice : priceList) {
                priceMap.put(tmpPrice.getBeginDate(), tmpPrice);
            }
        }

        //设置入住编号和主入住编号
        checkin.setCheckinId(genCheckinId());//入住系统ID
        checkin.setCheckinMid(checkin.getCheckinId());

        //设置入住人信息，并获得主入住人会员对象
        TGuest masterGuest  = CheckinGuest.setCheckinGuest(checkin, guests, hotelId);
        //根据大客户设置入住类型
        String bigVipId = BigVip.setCheckinBigVip(checkin, masterGuest);
        //设置预定信息，并获得预定对象
        TOrder tOrder = setCheckinOrder(checkin, bigVipId);
        //获得是否有前台修改房价标志
        long modifyRoomPrice = checkin.getCheckoutSettleFlag();
        String modifyOperId = "";
        if (modifyRoomPrice == modify_room_price_flag) {
            modifyOperId = getModifyPriceOperId(hotelId, checkin, empPhone);
        }

        prepareCheckinObject(empId, checkin);
        //设置联房信息，并获得联房房间的checkinid
        //没有联房时，lnCheckId为null
        String lnCheckId = validateCheckinLnRoom(checkin);

        //小时房，重新设置入住日期和离店日期
        if (Checkin.isHourRoom(checkin)) {
            Calendar curC = DateUtil.truncDate(DateUtil.getCurrentDate());
            checkin.setArriveDate(DateUtil.clone(curC));
            curC.add(Calendar.DATE, 1);
            checkin.setLeaveDate(curC);
        }


        //剩余押金
        double suplusYJ = 0;
        List<TBill> bills = new ArrayList<TBill>();
        if (!"".equals(checkin.getOrderId())) {//有预订ID 是预订转入住
            //todo: to clean this code;
            //减少预定的房间占用
            List<TRoomStatus> roomStatuses = TRoomStatus.findbyIdxRoomStatusId(tOrder.getNodeId(), tOrder.getOrderId(), "");
            for (TRoomStatus tRoomStatus : roomStatuses) {//遍历该预订编码的所有预订记录
                long inRoomCount = tRoomStatus.getRoomCount() - 1;
                tRoomStatus.setRoomCount(inRoomCount);//修改占用房间数量 -1
                //如果占用数量小于等于0，设置成不占用状态
                if (inRoomCount <= 0) {
                    tRoomStatus.setRoomInFlag(IHConstants.room_status_outroom);
                }
                updateList.add(tRoomStatus);//添加到待更新列表中
            }

            if (Checkin.isHourRoom(tCheckin)) {
                //预定转小时房

                //设置小时房开始入住时间和预计结束时间
                Checkin.setupClockCheckinTime(tCheckin.getNodeId(),tCheckin);

                //产生小时房账单
                TBill tBill = Bill.getBillHourRoom(tCheckin, tCheckin.getTimeRoomBegin(), tCheckin.getAllPrice());  //无论是否修改价格，小时房房价就是allprice
                tBills.add(tBill);//添加到列表中

                //大客户不减少押金  其他方式入住减少押金 房费
                if (!Checkin.isBigVipRoom(tCheckin.getBigVipId())) {
                    suplusYJ -= tBill.getAllBill();
                }
            } else {
                double minPrice =IHConstants.MAX_ROOM_PRICE;
                //预定转全日房间

                //添加预定转入住的结账单
                //查询预订时产生的每日房价列表
                List<TOrderbill> orderbills = TOrderbill.findbyIdxObOrderId(tCheckin.getOrderId(), "order by goods_id");
                //遍历预定订单，根据订单价格确定账单价格
                //
                for (TOrderbill tOrderbill : orderbills) {
                    TRoomprice tmpRoomPrice = new TRoomprice();
                    if (modifyRoomPrice == modify_room_price_flag) {
                        //如果是自定义价格，按照页面获得的价格处理
                        TRoomprice chnPrice = priceMap.get(tOrderbill.getGoodsId());
                        //如果是自定义房价，并且对象存在，使用自定义房价处理账单
                        //自定义账单价格，使用小时房价格临时存储
                        if (chnPrice != null) {
                            tmpRoomPrice.setPrice(chnPrice.getTimeRoomPrice());
                            minPrice = Math.min(minPrice,chnPrice.getTimeRoomPrice());
                        } else {
                            tmpRoomPrice.setPrice(tOrderbill.getPrice());
                            minPrice = Math.min(minPrice,tmpRoomPrice.getPrice());
                        }
                    } else {
                        tmpRoomPrice.setPrice(tOrderbill.getPrice());
                        minPrice = Math.min(minPrice,tmpRoomPrice.getPrice());
                    }
                    tmpRoomPrice.setBeginDate(tOrderbill.getGoodsId());


                    TBill tBill = Bill.getBillDayRoom(tCheckin, tmpRoomPrice);
                    tBills.add(tBill);//添加到列表中

                    //大客户不减少押金  其他方式入住减少押金 房费
                    if (!Checkin.isBigVipRoom(tCheckin.getBigVipId())) {
                        suplusYJ -= tBill.getAllBill();
                    }
                }
                if(minPrice == IHConstants.MAX_ROOM_PRICE)throw new CheckAlertException(IHConstants.exp_room_status_err);
                tCheckin.setPrice(minPrice);
            }

            //有预定，设置预订人信息
            tCheckin.setOrderName(tOrder.getOrderName());
            tCheckin.setOrderVipId(tOrder.getOrderVipId());
            tCheckin.setOrderGuestId(tOrder.getOrderGuestId());
            tCheckin.setOrderPhoneNum(tOrder.getOrderPhoneNum());

            tCheckin.setReceiptsFrontmoney(tOrder.getReceiptsFrontmoney() / tOrder.getRoomCount());
             

        } else {//没有预3订
            //判断是否是小时房
            if (Checkin.isHourRoom(tCheckin)) {
                //设置小时房开始入住时间和预计结束时间
                Checkin.setupClockCheckinTime(tCheckin.getNodeId(),tCheckin);

                //产生小时房账单
                TBill tBill = Bill.getBillHourRoom(tCheckin, tCheckin.getTimeRoomBegin(), tCheckin.getAllPrice()); //无论是否修改价格，小时房房价就是allprice
                tBills.add(tBill);//添加到列表中

                //大客户不减少押金  其他方式入住减少押金 房费
                if (!Checkin.isBigVipRoom(tCheckin.getBigVipId())) {
                    suplusYJ -= tBill.getAllBill();
                }
                tCheckin.setPrice(tBill.getPrice());

            } else {
                //获得价格类型
                String priceTypes[] = RoomPrice.getPriceTypeStrs(tCheckin.getBigVipId(), tCheckin.getGuestType());
                //查询每日房价
                List<TRoomprice> tRoomprices = Order.queryDailyPrice(tCheckin.getNodeId(), tCheckin.getRoomType(),
                        priceTypes[0], priceTypes[1],
                        tCheckin.getArriveDate(), tCheckin.getLeaveDate());

                //产生账单
                double minPrice =IHConstants.MAX_ROOM_PRICE;
                for (TRoomprice tRoomprice : tRoomprices) {
                    TRoomprice tmpRoomPrice = new TRoomprice();
                    if (modifyRoomPrice == modify_room_price_flag) {
                        //如果是自定义价格，按照页面获得的价格处理
                        TRoomprice chnPrice = priceMap.get(tRoomprice.getBeginDate());
                        //如果是自定义房价，并且对象存在，使用自定义房价处理账单
                        //自定义账单价格，使用小时房价格临时存储
                        //todo:remove this shit
                        if (chnPrice != null) {
                            tmpRoomPrice.setPrice(chnPrice.getTimeRoomPrice());
                            minPrice = Math.min(minPrice,chnPrice.getTimeRoomPrice());
                        } else {
                            tmpRoomPrice.setPrice(tRoomprice.getPrice());
                            minPrice = Math.min(minPrice,tRoomprice.getPrice());
                        }
                    } else {
                        tmpRoomPrice.setPrice(tRoomprice.getPrice());
                        minPrice = Math.min(minPrice,tRoomprice.getPrice());
                    }
                    tmpRoomPrice.setBeginDate(tRoomprice.getBeginDate());

                    //产生每日房间账单
                    TBill tBill = Bill.getBillDayRoom(tCheckin, tmpRoomPrice);
                    tBills.add(tBill);//添加到列表中

                    //大客户不减少押金  其他方式入住减少押金 房费
                    if (!Checkin.isBigVipRoom(tCheckin.getBigVipId())) {
                        suplusYJ -= tBill.getAllBill();
                    }
                }
                if(minPrice>=IHConstants.MAX_ROOM_PRICE)throw new CheckAlertException(IHConstants.exp_room_status_err);
                tCheckin.setPrice(minPrice);
            }
            return suplusYJ;

        }

        //入住 产生押金账单
        TBill tBillDep = Bill.getBillDeposit(checkin, Bill.bill_name_FM,
                checkin.getReceiptsDeposit(), Bill.new_yajin_falg);
        //押金，定金，账单实收
        Bill.setBillSettle(tBillDep, empId);
        bills.add(tBillDep);//添加到列表中
        //增加押金 押金
        suplusYJ += tBillDep.getAllBill();

        //入住 产生定账单
        TBill tBillFm = Bill.getBillFrontmoney(checkin);
        //押金，定金，账单实收
        Bill.setBillSettle(tBillFm, empId);
        bills.add(tBillFm);//添加到列表中
        //增加押金 定金
        suplusYJ += tBillFm.getAllBill();


        List<TRoomStatus> createRoomStatusList = new ArrayList<TRoomStatus>();
        fillRoomOccupyList(checkin, createRoomStatusList);

        //查询出来房间
        TRoom room = new TRoom(checkin.getRoomId());
        //更改入住房间状态
        if (Room.room_status_chkin.equals(room.getRoomStatus()) || Room.room_status_chkin_hour.equals(room.getRoomStatus())) {//是入住状态的 就不能入住
            throw new CheckAlertException(IHConstants.exp_room_has_chkin);//抛出异常
        }
        if (Checkin.isHourRoom(checkin)) {
            //入住选择小时房，但房间设置不允许小时房，抛出异常
            if (room.getTimeRoom() == Room.room_timeroom_false) {
                throw new CheckAlertException(IHConstants.exp_room_not_timeroom);//抛出异常
            }
        }

        if (Checkin.isHourRoom(checkin)) {
            //小时房入住
            room.setRoomStatus(Room.room_status_chkin_hour);//设置为入住状态
        } else {
            room.setRoomStatus(Room.room_status_chkin);//设置为入住状态
        }
        room.setCheckinId(checkin.getCheckinId());
        room.setLnRoomCheckinId(checkin.getLnRoomCheckinId());
        //设置入住人
        TCheckinGuest tmpGuest = guests.get(0);
        room.setGuestName(tmpGuest.getGuestName());
        room.setSuplusDeposit(suplusYJ);       //设置剩余押金

        checkin.setFloorId(room.getFloorId());
        checkin.setRoomName(room.getRoomName());

        //设置好房间号后，设置账单内容
        Bill.setBilCheckout(tBillDep, checkin.getRoomName());
        Bill.setBilCheckout(tBillFm, checkin.getRoomName());

        checkin.setOriginRoomStatus(Checkin.checkin_room_status_chkin);

        saveCheckin(trConn, empId, checkin, guests,
                priceList, updateRoomStatusList, createRoomStatusList, bills,
                room, masterGuest, tOrder, modifyRoomPrice,
                modifyOperId, lnCheckId);

        return checkin;
    }